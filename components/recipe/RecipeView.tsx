import React from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Recipe } from "../../types/recipe";
import { useTabBarClearance } from "../../theme/layout";
import { useThemeColors } from "../../theme/useThemeColors";
import { useFavorite } from "../../hooks/useFavorite";

import RecipeHeroImage from "./view/RecipeHeroImage";
import RecipeInfoCard from "./view/RecipeInfoCard";
import RecipeIngredients from "./view/RecipeIngredients";
import RecipeSteps from "./view/RecipeSteps";

export default function RecipeView({ recipe }: { recipe: Recipe }) {
  const insets = useSafeAreaInsets();
  const tabBarClearance = useTabBarClearance();
  const colors = useThemeColors();
  const { isFavorite, toggleFavorite } = useFavorite(recipe.id);

  return (
    <ScrollView
      // The navigator's scene background is light by default; without an
      // explicit themed background the area between cards stays light in
      // dark mode.
      style={{ flex: 1, backgroundColor: colors.background.default }}
      contentContainerStyle={{ paddingBottom: tabBarClearance }}
      showsVerticalScrollIndicator={false}
    >
      <RecipeHeroImage
        recipe={recipe}
        insetTop={insets.top}
        isFavorite={isFavorite}
        onToggleFavorite={toggleFavorite}
      />
      <RecipeInfoCard recipe={recipe} />
      <RecipeIngredients
        ingredients={recipe.ingredients}
        recipeId={recipe.id}
        recipeTitle={recipe.title}
      />
      <RecipeSteps steps={recipe.steps} />
      <View style={{ height: 20 }} />
    </ScrollView>
  );
}
