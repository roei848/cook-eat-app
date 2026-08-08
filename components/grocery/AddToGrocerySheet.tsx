import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
} from "react-native";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";

import { Ingredient } from "../../types/recipe";
import { GroceryItem } from "../../types/grocery";
import { RootState } from "../../store/store";
import { useThemeColors } from "../../theme/useThemeColors";
import { ThemeColors } from "../../theme/colors";
import {
  addGroceryItems,
  deleteGroceryItem,
} from "../../services/firebase/groceryService";

interface Props {
  visible: boolean;
  onClose: () => void;
  ingredients: Ingredient[];
  recipeId: string;
  recipeTitle?: string;
}

export default function AddToGrocerySheet({
  visible,
  onClose,
  ingredients,
  recipeId,
  recipeTitle,
}: Props) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const uid = useSelector((state: RootState) => state.auth.user?.uid);
  const groceryItems = useSelector((state: RootState) => state.grocery.items);

  const validIngredients = useMemo(
    () => ingredients.filter((ingredient) => ingredient.name.trim() !== ""),
    [ingredients]
  );

  // Recipe-sourced grocery items for this recipe, keyed by ingredient name
  const onListByName = useMemo(() => {
    const map = new Map<string, GroceryItem>();
    groceryItems.forEach((item) => {
      if (item.sourceRecipeId === recipeId) {
        map.set(item.name, item);
      }
    });
    return map;
  }, [groceryItems, recipeId]);

  const [unselected, setUnselected] = useState<Set<string>>(new Set());

  // Every open starts with all ingredients checked
  useEffect(() => {
    if (visible) {
      setUnselected(new Set());
    }
  }, [visible]);

  const toggle = (name: string) => {
    setUnselected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  const hasChanges = useMemo(
    () =>
      validIngredients.some((ingredient) => {
        const name = ingredient.name.trim();
        const selected = !unselected.has(name);
        const onList = onListByName.has(name);
        return selected !== onList;
      }),
    [validIngredients, unselected, onListByName]
  );

  const handleApply = () => {
    if (!uid || !hasChanges) return;

    const toAdd = validIngredients.filter((ingredient) => {
      const name = ingredient.name.trim();
      return !unselected.has(name) && !onListByName.has(name);
    });

    const toRemove = validIngredients.filter((ingredient) => {
      const name = ingredient.name.trim();
      return unselected.has(name) && onListByName.has(name);
    });

    addGroceryItems(
      uid,
      toAdd.map((ingredient) => ({
        name: ingredient.name,
        amount: ingredient.amount,
        sourceRecipeId: recipeId,
        sourceRecipeTitle: recipeTitle,
      }))
    );

    toRemove.forEach((ingredient) => {
      const existing = onListByName.get(ingredient.name.trim());
      if (existing) {
        deleteGroceryItem(uid, existing.id);
      }
    });

    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose} />

      <View style={styles.sheet}>
        <View style={styles.handle} />

        <View style={styles.header}>
          <Text style={styles.title}>הוספה לרשימת קניות</Text>
          <Pressable
            onPress={handleApply}
            hitSlop={8}
            style={[styles.addButton, !hasChanges && styles.addButtonDisabled]}
          >
            <Text style={styles.addButtonText}>הוספה</Text>
          </Pressable>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {validIngredients.map((ingredient, idx) => {
            const name = ingredient.name.trim();
            const selected = !unselected.has(name);

            return (
              <Pressable
                key={idx}
                style={styles.row}
                onPress={() => toggle(name)}
              >
                <Ionicons
                  name={selected ? "checkbox" : "square-outline"}
                  size={24}
                  color={selected ? colors.primary[500] : colors.text.muted}
                />
                <Text style={styles.name}>{ingredient.name}</Text>
                {ingredient.amount ? (
                  <Text style={styles.amount}>{ingredient.amount}</Text>
                ) : null}
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    </Modal>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.4)",
    },
    sheet: {
      backgroundColor: colors.card.default,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingHorizontal: 20,
      paddingTop: 10,
      paddingBottom: 32,
      maxHeight: "70%",
    },
    handle: {
      alignSelf: "center",
      width: 40,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.border.default,
      marginBottom: 14,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 16,
    },
    title: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text.primary,
    },
    addButton: {
      backgroundColor: colors.primary[500],
      borderRadius: 20,
      paddingHorizontal: 18,
      paddingVertical: 8,
    },
    addButtonDisabled: {
      backgroundColor: colors.text.muted,
    },
    addButtonText: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.text.inverse,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.default,
    },
    name: {
      fontSize: 15,
      color: colors.text.primary,
      flex: 1,
    },
    amount: {
      fontSize: 13,
      color: colors.text.muted,
    },
  });
