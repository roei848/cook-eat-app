import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { Recipe } from "../../../types/recipe";
import { typography } from "../../../theme/typography";
import { radius } from "../../../theme/spacing";
import RecipeCategoryBadge from "./RecipeCategoryBadge";
import RecipePhotoBackdrop from "./RecipePhotoBackdrop";
import ScalePressable from "../../ui/ScalePressable";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");
const HERO_HEIGHT = SCREEN_HEIGHT * 0.45;

export default function RecipeHeroImage({
  recipe,
  insetTop,
  isFavorite,
  onToggleFavorite,
}: {
  recipe: Recipe;
  insetTop: number;
  isFavorite?: boolean;
  /** Heart button renders only when provided. */
  onToggleFavorite?: () => void;
}) {
  return (
    <Animated.View entering={FadeIn.duration(400)} style={styles.container}>
      <RecipePhotoBackdrop
        imageUrl={recipe.imageUrl}
        category={recipe.category}
      />

      {/* Title on gradient */}
      <Text style={styles.title}>{recipe.title}</Text>

      {/* Category badge — top trailing, below header */}
      <View style={[styles.badgeContainer, { top: insetTop + 54 }]}>
        <RecipeCategoryBadge category={recipe.category} />
      </View>

      {/* Favorite heart — mirror position of the category badge. Like the
          badge, it sits on the photo, so its colors are theme-independent. */}
      {onToggleFavorite && (
        <View style={[styles.heartContainer, { top: insetTop + 54 }]}>
          <ScalePressable
            onPress={onToggleFavorite}
            scaleTo={0.9}
            style={styles.heartButton}
            accessibilityRole="button"
            accessibilityLabel={
              isFavorite ? "הסר מהמועדפים" : "הוסף למועדפים"
            }
          >
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={22}
              color={isFavorite ? "#FF6B6B" : "#FFFFFF"}
            />
          </ScalePressable>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: HERO_HEIGHT,
    overflow: "hidden",
  },
  title: {
    position: "absolute",
    bottom: 32,
    start: 20,
    end: 20,
    ...typography.displayL,
    color: "#FFFFFF",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  badgeContainer: {
    position: "absolute",
    start: 16,
  },
  heartContainer: {
    position: "absolute",
    end: 16,
  },
  heartButton: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.45)",
  },
});
