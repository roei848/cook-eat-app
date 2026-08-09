import React from "react";
import { FlatList, StyleSheet } from "react-native";

import RecipeCardHorizontal from "../recipe/RecipeCardHorizontal";
import { Recipe } from "../../types/recipe";
import { SCREEN_PADDING_H, spacing } from "../../theme/spacing";

type Props = {
  recipes: Recipe[];
  onPressRecipe: (recipe: Recipe) => void;
};

/** Horizontal recipe rail shared by the Home sections. */
export default function RecipeRail({ recipes, onPressRecipe }: Props) {
  return (
    <FlatList
      data={recipes}
      keyExtractor={(item) => item.id ?? item.title}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}
      renderItem={({ item }) => (
        <RecipeCardHorizontal recipe={item} onPress={() => onPressRecipe(item)} />
      )}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    paddingStart: SCREEN_PADDING_H,
    paddingEnd: spacing.sm,
  },
});
