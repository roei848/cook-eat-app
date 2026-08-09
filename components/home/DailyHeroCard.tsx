import React from "react";
import { StyleSheet, Text, View } from "react-native";

import ScalePressable from "../ui/ScalePressable";
import RecipeCategoryBadge from "../recipe/view/RecipeCategoryBadge";
import RecipePhotoBackdrop from "../recipe/view/RecipePhotoBackdrop";
import { Recipe } from "../../types/recipe";
import { useThemeColors } from "../../theme/useThemeColors";
import { typography } from "../../theme/typography";
import { radius, SCREEN_PADDING_H, spacing } from "../../theme/spacing";

type Props = {
  recipe: Recipe;
  onPress: () => void;
};

/** The Home "recipe of the day" hero — a full-width editorial photo card. */
export default function DailyHeroCard({ recipe, onPress }: Props) {
  const colors = useThemeColors();

  const byWho = recipe.byWho?.trim();
  const meta = byWho
    ? `מהמטבח של ${byWho} · ${recipe.timeInMinutes} דק׳`
    : `${recipe.timeInMinutes} דק׳`;

  return (
    <ScalePressable
      onPress={onPress}
      scaleTo={0.97}
      style={[styles.card, { backgroundColor: colors.card.default }]}
      accessibilityRole="button"
      accessibilityLabel={`המתכון של היום: ${recipe.title}`}
    >
      <RecipePhotoBackdrop
        imageUrl={recipe.imageUrl}
        category={recipe.category}
      />

      <View style={styles.badgeContainer}>
        <RecipeCategoryBadge category={recipe.category} />
      </View>

      <View style={styles.textBlock}>
        <Text style={styles.title} numberOfLines={2}>
          {recipe.title}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {meta}
        </Text>
      </View>
    </ScalePressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: SCREEN_PADDING_H,
    aspectRatio: 4 / 5,
    borderRadius: radius.lg,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 5,
  },
  badgeContainer: {
    position: "absolute",
    top: spacing.lg,
    start: spacing.lg,
  },
  textBlock: {
    position: "absolute",
    bottom: spacing.xl,
    start: spacing.xl,
    end: spacing.xl,
  },
  title: {
    ...typography.displayL,
    color: "#FFFFFF",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  meta: {
    ...typography.caption,
    color: "rgba(255,255,255,0.85)",
    marginTop: spacing.xs,
  },
});
