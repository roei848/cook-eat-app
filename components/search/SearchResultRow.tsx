import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

import { Recipe } from "../../types/recipe";
import { useThemeColors } from "../../theme/useThemeColors";
import { ThemeColors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { radius, spacing } from "../../theme/spacing";
import ScalePressable from "../ui/ScalePressable";
import CategoryBadge from "../category/CategoryBadge";

type Props = {
  recipe: Recipe;
  onPress: () => void;
};

/** Compact search-result row: thumbnail, title, category chip + time. */
export default function SearchResultRow({ recipe, onPress }: Props) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  return (
    <ScalePressable onPress={onPress} style={styles.row}>
      <Image
        source={
          recipe.imageUrl
            ? { uri: recipe.imageUrl }
            : require("../../assets/arthur.png")
        }
        style={styles.thumbnail}
      />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {recipe.title}
        </Text>
        <View style={styles.metaRow}>
          <CategoryBadge category={recipe.category} withIcon={false} />
          <Text style={styles.time}>{recipe.timeInMinutes} דק׳</Text>
        </View>
      </View>
    </ScalePressable>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    row: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card.default,
      borderRadius: radius.md,
      padding: spacing.sm + 2,
      gap: spacing.md,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 6,
      elevation: 2,
    },
    thumbnail: {
      width: 60,
      height: 60,
      borderRadius: radius.sm,
      backgroundColor: colors.background.secondary,
    },
    content: {
      flex: 1,
      gap: spacing.xs,
    },
    title: {
      ...typography.title,
      color: colors.text.primary,
    },
    metaRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
    },
    time: {
      ...typography.caption,
      color: colors.text.secondary,
    },
  });
