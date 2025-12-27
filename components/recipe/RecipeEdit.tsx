import React from "react";
import { ScrollView, StyleSheet, TextInput } from "react-native";
import { Recipe } from "../../types/recipe";
import { useThemeColors } from "../../theme/useThemeColors";
import { ThemeColors } from "../../theme/colors";

type Props = {
  recipe: Recipe;
  onChange: (recipe: Recipe) => void;
};

export default function RecipeEdit({ recipe, onChange }: Props) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  return (
    <ScrollView
      style={{
        flex: 1,
        padding: 16,
        backgroundColor: colors.background.default,
      }}
    >
      <TextInput
        value={recipe.title}
        onChangeText={(title) => onChange({ ...recipe, title })}
        placeholder="Title"
        style={styles.input}
      />

      <TextInput
        value={recipe.description}
        onChangeText={(description) => onChange({ ...recipe, description })}
        placeholder="Description"
        multiline
        style={[styles.input, { height: 100 }]}
      />
    </ScrollView>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    input: {
      backgroundColor: colors.card.default,
      borderRadius: 12,
      padding: 12,
      marginBottom: 16,
      color: colors.text.primary,
    },
  });
