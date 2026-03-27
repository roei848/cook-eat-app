import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { ThemeColors } from "../../../theme/colors";
import { useThemeColors } from "../../../theme/useThemeColors";
import { Ingredient } from "../../../types/recipe";

interface IngredientEditorProps {
  ingredients: Ingredient[];
  onChange: (ingredients: Ingredient[]) => void;
}

export default function IngredientEditor({ ingredients, onChange }: IngredientEditorProps) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  function updateIngredient(index: number, field: keyof Ingredient, value: string) {
    const updated = ingredients.map((ing, i) =>
      i === index ? { ...ing, [field]: value } : ing
    );
    onChange(updated);
  }

  function addIngredient() {
    onChange([...ingredients, { name: "", amount: "" }]);
  }

  function removeIngredient(index: number) {
    onChange(ingredients.filter((_, i) => i !== index));
  }

  return (
    <View>
      <FlatList
        data={ingredients}
        keyExtractor={(_, index) => index.toString()}
        scrollEnabled={false}
        renderItem={({ item, index }) => (
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => removeIngredient(index)}
            >
              <Ionicons name="remove-circle" size={22} color={colors.danger[500]} />
            </TouchableOpacity>
            <TextInput
              style={[styles.input, styles.inputAmount]}
              value={item.amount}
              onChangeText={(text) => updateIngredient(index, "amount", text)}
              placeholder="כמות"
              placeholderTextColor={colors.text.muted}
              textAlign="right"
            />
            <TextInput
              style={[styles.input, styles.inputName]}
              value={item.name}
              onChangeText={(text) => updateIngredient(index, "name", text)}
              placeholder="רכיב"
              placeholderTextColor={colors.text.muted}
              textAlign="right"
            />
          </View>
        )}
        ListFooterComponent={
          <TouchableOpacity style={styles.addButton} onPress={addIngredient}>
            <Ionicons name="add-circle-outline" size={20} color={colors.primary[500]} />
            <Text style={styles.addButtonText}>הוסף רכיב</Text>
          </TouchableOpacity>
        }
      />
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    row: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
      gap: 8,
    },
    deleteButton: {
      padding: 2,
    },
    input: {
      backgroundColor: colors.card.default,
      borderWidth: 1,
      borderColor: colors.border.default,
      borderRadius: 10,
      paddingVertical: 10,
      paddingHorizontal: 12,
      fontSize: 15,
      color: colors.text.primary,
    },
    inputName: {
      flex: 2,
    },
    inputAmount: {
      flex: 1,
    },
    addButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingVertical: 10,
      justifyContent: "center",
    },
    addButtonText: {
      fontSize: 15,
      color: colors.primary[500],
      fontWeight: "600",
    },
  });
