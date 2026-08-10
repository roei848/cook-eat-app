import React, { useCallback, useRef } from "react";
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
import RecipeNotes from "./view/RecipeNotes";

export default function RecipeView({ recipe }: { recipe: Recipe }) {
  const insets = useSafeAreaInsets();
  const tabBarClearance = useTabBarClearance();
  const colors = useThemeColors();
  const { isFavorite, toggleFavorite } = useFavorite(recipe.id);

  const scrollRef = useRef<ScrollView>(null);

  const handleComposerFocus = useCallback(() => {
    // Delay so the keyboard has started animating in — scrolling immediately
    // measures against the pre-keyboard viewport and lands short.
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 250);
  }, []);

  return (
    <ScrollView
      ref={scrollRef}
      // The navigator's scene background is light by default; without an
      // explicit themed background the area between cards stays light in
      // dark mode.
      style={{ flex: 1, backgroundColor: colors.background.default }}
      contentContainerStyle={{ paddingBottom: tabBarClearance }}
      showsVerticalScrollIndicator={false}
      // Without this the first tap on the send button only dismisses the
      // keyboard instead of submitting.
      keyboardShouldPersistTaps="handled"
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
      {recipe.id && (
        <RecipeNotes
          recipeId={recipe.id}
          notes={recipe.notes}
          onComposerFocus={handleComposerFocus}
        />
      )}
      <View style={{ height: 20 }} />
    </ScrollView>
  );
}
