import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Screen from "../Screen";
import Loader from "../../components/shared/Loader";
import GroceryItemRow from "../../components/grocery/GroceryItemRow";
import { RootState } from "../../store/store";
import { GroceryItem } from "../../types/grocery";
import { useThemeColors } from "../../theme/useThemeColors";
import { ThemeColors } from "../../theme/colors";
import {
  addGroceryItem,
  setGroceryItemChecked,
  deleteGroceryItem,
  deleteGroceryItems,
} from "../../services/firebase/groceryService";

export default function GroceryListScreen() {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const uid = useSelector((state: RootState) => state.auth.user?.uid);
  const items = useSelector((state: RootState) => state.grocery.items);
  const subscribed = useSelector(
    (state: RootState) => state.grocery.subscribed
  );
  const error = useSelector((state: RootState) => state.grocery.error);

  const [newItemName, setNewItemName] = useState("");

  const sections = useMemo(() => {
    const unchecked = items.filter((item) => !item.checked);
    const checked = items.filter((item) => item.checked);

    return [
      { key: "unchecked", data: unchecked },
      ...(checked.length ? [{ key: "checked", data: checked }] : []),
    ];
  }, [items]);

  const checkedIds = useMemo(
    () => items.filter((item) => item.checked).map((item) => item.id),
    [items]
  );

  const handleAddItem = () => {
    const name = newItemName.trim();
    if (!name || !uid) return;

    addGroceryItem(uid, { name, amount: "" });
    setNewItemName("");
  };

  const handleToggle = (item: GroceryItem) => {
    if (!uid) return;
    setGroceryItemChecked(uid, item.id, !item.checked);
  };

  const handleDelete = (item: GroceryItem) => {
    if (!uid) return;
    deleteGroceryItem(uid, item.id);
  };

  const handleClearChecked = () => {
    if (!uid) return;
    deleteGroceryItems(uid, checkedIds);
  };

  const handleClearAll = () => {
    if (!uid) return;

    Alert.alert("ניקוי הרשימה", "האם למחוק את כל הפריטים ברשימה?", [
      { text: "ביטול", style: "cancel" },
      {
        text: "מחיקה",
        style: "destructive",
        onPress: () =>
          deleteGroceryItems(
            uid,
            items.map((item) => item.id)
          ),
      },
    ]);
  };

  if (!subscribed) {
    return (
      <Screen>
        <View style={styles.centered}>
          <Loader text="טוען רשימת קניות..." />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>רשימת קניות</Text>
        {items.length > 0 && (
          <Pressable onPress={handleClearAll} hitSlop={8}>
            <Text style={styles.clearAllText}>נקה הכל</Text>
          </Pressable>
        )}
      </View>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={newItemName}
          onChangeText={setNewItemName}
          placeholder="הוספת פריט חדש..."
          placeholderTextColor={colors.text.muted}
          textAlign="right"
          returnKeyType="done"
          onSubmitEditing={handleAddItem}
          blurOnSubmit={false}
        />
        <Pressable onPress={handleAddItem} hitSlop={8}>
          <Ionicons name="add-circle" size={36} color={colors.primary[500]} />
        </Pressable>
      </View>

      {error ? (
        <View style={styles.centered}>
          <Ionicons name="alert-circle-outline" size={64} color={colors.danger[500]} />
          <Text style={styles.emptyTitle}>שגיאה בטעינת הרשימה</Text>
          <Text style={styles.emptySubtitle}>{error}</Text>
        </View>
      ) : items.length === 0 ? (
        <View style={styles.centered}>
          <Ionicons name="cart-outline" size={64} color={colors.text.muted} />
          <Text style={styles.emptyTitle}>רשימת הקניות ריקה</Text>
          <Text style={styles.emptySubtitle}>
            הוסיפו מצרכים ממתכון או הקלידו פריט חדש
          </Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled={false}
          renderItem={({ item }) => (
            <GroceryItemRow
              item={item}
              onToggle={() => handleToggle(item)}
              onDelete={() => handleDelete(item)}
            />
          )}
          renderSectionHeader={({ section }) =>
            section.key === "checked" ? (
              <View style={styles.checkedHeader}>
                <Text style={styles.checkedHeaderText}>פריטים שנאספו</Text>
                <Pressable onPress={handleClearChecked} hitSlop={8}>
                  <Text style={styles.clearButtonText}>ניקוי מסומנים</Text>
                </Pressable>
              </View>
            ) : null
          }
        />
      )}
    </Screen>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 8,
    },
    title: {
      fontSize: 28,
      fontWeight: "800",
      color: colors.text.primary,
      letterSpacing: -0.5,
    },
    clearAllText: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.danger[500],
    },
    inputRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      marginHorizontal: 20,
      marginBottom: 16,
    },
    input: {
      flex: 1,
      backgroundColor: colors.card.default,
      borderRadius: 16,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
      color: colors.text.primary,
      borderWidth: 1,
      borderColor: colors.border.default,
    },
    listContent: {
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
    checkedHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 12,
      marginBottom: 10,
    },
    checkedHeaderText: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.text.secondary,
    },
    clearButtonText: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.danger[500],
    },
    centered: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      paddingHorizontal: 40,
      paddingBottom: 80,
    },
    emptyTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.text.primary,
      marginTop: 8,
    },
    emptySubtitle: {
      fontSize: 14,
      color: colors.text.muted,
      textAlign: "center",
    },
  });
