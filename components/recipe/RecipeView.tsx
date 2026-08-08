import React from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Recipe } from "../../types/recipe";
import { useTabBarClearance } from "../../theme/layout";

import RecipeHeroImage from "./view/RecipeHeroImage";
import RecipeInfoCard from "./view/RecipeInfoCard";
import RecipeIngredients from "./view/RecipeIngredients";
import RecipeSteps from "./view/RecipeSteps";

export default function RecipeView({ recipe }: { recipe: Recipe }) {
  const insets = useSafeAreaInsets();
  const tabBarClearance = useTabBarClearance();

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingBottom: tabBarClearance }}
      showsVerticalScrollIndicator={false}
    >
      <RecipeHeroImage recipe={recipe} insetTop={insets.top} />
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
