import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import Animated, { FadeInDown, LinearTransition } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

import { ThemeColors } from "../../../theme/colors";
import { useThemeColors } from "../../../theme/useThemeColors";
import { Ingredient } from "../../../types/recipe";
import { typography } from "../../../theme/typography";
import { radius, spacing } from "../../../theme/spacing";
import ScalePressable from "../../ui/ScalePressable";

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
      {ingredients.map((item, index) => (
        <Animated.View
          key={index}
          entering={FadeInDown.springify().damping(18)}
          layout={LinearTransition}
          style={styles.row}
        >
          <TextInput
            style={[styles.input, styles.inputAmount]}
            value={item.amount}
            onChangeText={(text) => updateIngredient(index, "amount", text)}
            placeholder="כמות"
            placeholderTextColor={colors.text.muted}
          />
          <TextInput
            style={[styles.input, styles.inputName]}
            value={item.name}
            onChangeText={(text) => updateIngredient(index, "name", text)}
            placeholder="רכיב"
            placeholderTextColor={colors.text.muted}
          />
          <ScalePressable
            onPress={() => removeIngredient(index)}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="הסרת רכיב"
          >
            <Ionicons name="remove-circle" size={22} color={colors.danger[500]} />
          </ScalePressable>
        </Animated.View>
      ))}

      <Animated.View layout={LinearTransition}>
        <ScalePressable
          onPress={addIngredient}
          style={styles.addButton}
          accessibilityRole="button"
        >
          <Ionicons name="add-circle-outline" size={20} color={colors.primary[500]} />
          <Text style={styles.addButtonText}>הוספת רכיב</Text>
        </ScalePressable>
      </Animated.View>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    row: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: spacing.sm,
      gap: spacing.sm,
    },
    input: {
      backgroundColor: colors.card.default,
      borderWidth: 1.5,
      borderColor: colors.border.default,
      borderRadius: radius.sm,
      paddingVertical: 12,
      paddingHorizontal: 14,
      ...typography.body,
      color: colors.text.primary,
    },
    inputAmount: {
      flex: 1,
    },
    inputName: {
      flex: 2,
    },
    addButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      paddingVertical: spacing.md,
    },
    addButtonText: {
      ...typography.title,
      color: colors.primary[500],
    },
  });
