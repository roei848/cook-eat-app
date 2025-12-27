import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Recipe } from "../../types/recipe";
import { useThemeColors } from "../../theme/useThemeColors";

import CookingTimeBox from "./CookingTimeBox";
import DifficultyBox from "./DifficultyBox";
import { ThemeColors } from "../../theme/colors";

export default function RecipeView({ recipe }: { recipe: Recipe }) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{recipe.title}</Text>
      <Text style={styles.description}>{recipe.description}</Text>

      <View style={styles.meta}>
        <CookingTimeBox minutes={recipe.timeInMinutes} />
        <DifficultyBox difficulty={recipe.difficulty} />
      </View>

      <Text style={styles.section}>Ingredients</Text>
      {recipe.ingredients.map((i, idx) => (
        <Text key={idx} style={styles.item}>
          • {i.amount} {i.name}
        </Text>
      ))}

      <Text style={styles.section}>Steps</Text>
      {recipe.steps
        .sort((a, b) => a.order - b.order)
        .map((s) => (
          <Text key={s.order} style={styles.item}>
            {s.order}. {s.text}
          </Text>
        ))}
    </ScrollView>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: colors.background.default,
    },
    title: {
      fontSize: 24,
      fontWeight: "700",
      color: colors.text.primary,
    },
    description: {
      marginTop: 8,
      color: colors.text.secondary,
    },
    meta: {
      flexDirection: "row",
      marginVertical: 16,
      gap: 12,
    },
    section: {
      marginTop: 24,
      marginBottom: 8,
      fontSize: 18,
      fontWeight: "600",
      color: colors.text.primary,
    },
    item: {
      marginBottom: 6,
      color: colors.text.primary,
    },
  });
