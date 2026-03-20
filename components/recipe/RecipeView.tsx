import React from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Recipe } from "../../types/recipe";

import RecipeHeroImage from "./view/RecipeHeroImage";
import RecipeInfoCard from "./view/RecipeInfoCard";
import RecipeIngredients from "./view/RecipeIngredients";
import RecipeSteps from "./view/RecipeSteps";

export default function RecipeView({ recipe }: { recipe: Recipe }) {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <RecipeHeroImage recipe={recipe} insetTop={insets.top} />
      <RecipeInfoCard recipe={recipe} />
      <RecipeIngredients ingredients={recipe.ingredients} />
      <RecipeSteps steps={recipe.steps} />
      <View style={{ height: 20 }} />
    </ScrollView>
  );
}
