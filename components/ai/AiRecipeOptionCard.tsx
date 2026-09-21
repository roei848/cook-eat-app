import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import Animated, { FadeInUp } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

import { RootState } from "../../store/store";
import { ThemeColors } from "../../theme/colors";
import { useThemeColors } from "../../theme/useThemeColors";
import { CATEGORY_COLORS, withAlpha } from "../../theme/categoryColors";
import { typography } from "../../theme/typography";
import { radius, spacing } from "../../theme/spacing";
import { Category } from "../../types/enums/category";
import { AiIdeasMode, AiRecipeOption } from "../../types/aiIdeas";
import CookingTimeBox from "../recipe/CookingTimeBox";
import DifficultyBox from "../recipe/DifficultyBox";
import CategoryBadge from "../category/CategoryBadge";
import RecipeRelativesTags from "../recipe/view/RecipeRelativesTags";
import ScalePressable from "../ui/ScalePressable";

interface AiRecipeOptionCardProps {
  option: AiRecipeOption;
  mode: AiIdeasMode;
  /** Position in the list, for the staggered entrance. */
  index: number;
  isSaved: boolean;
  onPress: () => void;
}

/**
 * One AI-proposed recipe. There is no photo, so the category tint and icon
 * carry the visual identity instead of a repeated placeholder image.
 */
export default function AiRecipeOptionCard({
  option,
  mode,
  index,
  isSaved,
  onPress,
}: AiRecipeOptionCardProps) {
  const colors = useThemeColors();
  const styles = createStyles(colors);
  const isDark = useSelector(
    (state: RootState) => state.user.profile?.darkMode ?? false
  );

  const { recipe } = option;
  const category = recipe.category ?? Category.OTHER;
  const entry = CATEGORY_COLORS[category];
  // Same demoted-tint rule as CategoryPicker / CategoryBadge
  const tint = isDark ? withAlpha(entry.dark, 0.5) : withAlpha(entry.light, 0.16);
  const foreground = isDark ? entry.light : entry.dark;

  const showFridgeLines = mode === "fridge";

  return (
    <Animated.View entering={FadeInUp.delay(150 + index * 100)}>
      <ScalePressable
        onPress={onPress}
        disabled={isSaved}
        style={[styles.card, isSaved && styles.cardSaved]}
        accessibilityRole="button"
        accessibilityState={{ disabled: isSaved }}
        accessibilityLabel={isSaved ? `${recipe.title}, נשמר` : recipe.title}
      >
        <View style={styles.header}>
          <View style={[styles.iconCircle, { backgroundColor: tint }]}>
            <Ionicons name={entry.icon as any} size={26} color={foreground} />
          </View>
          <Text style={styles.title} numberOfLines={2}>
            {recipe.title}
          </Text>
          {isSaved ? (
            <View style={styles.savedPill}>
              <Ionicons name="checkmark-circle" size={14} color={colors.accent.mintText} />
              <Text style={styles.savedText}>נשמר</Text>
            </View>
          ) : (
            // chevron-back = forward disclosure under forced RTL
            <Ionicons name="chevron-back" size={20} color={colors.text.muted} />
          )}
        </View>

        {recipe.description ? (
          <Text style={styles.description} numberOfLines={3}>
            {recipe.description}
          </Text>
        ) : null}

        <View style={styles.metaRow}>
          {recipe.timeInMinutes != null && (
            <CookingTimeBox minutes={recipe.timeInMinutes} />
          )}
          {recipe.difficulty && <DifficultyBox difficulty={recipe.difficulty} />}
          <CategoryBadge category={category} withIcon={false} />
        </View>

        <RecipeRelativesTags relatives={recipe.relatives ?? []} />

        {showFridgeLines && option.usedIngredients.length > 0 && (
          <View style={styles.fridgeLine}>
            <Ionicons name="checkmark-done-outline" size={14} color={colors.accent.mintText} />
            <Text style={styles.usedText}>
              משתמש ב-{option.usedIngredients.length} מהמצרכים שלך
            </Text>
          </View>
        )}
        {showFridgeLines && option.missingIngredients.length > 0 && (
          <View style={styles.fridgeLine}>
            <Ionicons name="cart-outline" size={14} color={colors.text.muted} />
            <Text style={styles.missingText} numberOfLines={2}>
              חסר: {option.missingIngredients.join(", ")}
            </Text>
          </View>
        )}
      </ScalePressable>
    </Animated.View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.card.default,
      borderRadius: radius.md,
      padding: spacing.xl,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.07,
      shadowRadius: 8,
      elevation: 4,
    },
    cardSaved: {
      opacity: 0.7,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
    },
    iconCircle: {
      width: 56,
      height: 56,
      borderRadius: radius.sm,
      justifyContent: "center",
      alignItems: "center",
    },
    title: {
      flex: 1,
      ...typography.titleL,
      color: colors.text.primary,
    },
    savedPill: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      paddingVertical: 4,
      paddingHorizontal: 10,
      borderRadius: radius.pill,
      backgroundColor: colors.accent.mintBg,
    },
    savedText: {
      ...typography.label,
      color: colors.accent.mintText,
    },
    description: {
      ...typography.bodySmall,
      color: colors.text.secondary,
      marginTop: spacing.md,
    },
    metaRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "center",
      gap: spacing.sm,
      marginTop: spacing.md,
    },
    fridgeLine: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 6,
      marginTop: spacing.sm,
    },
    usedText: {
      ...typography.caption,
      color: colors.accent.mintText,
    },
    missingText: {
      flex: 1,
      ...typography.caption,
      color: colors.text.muted,
    },
  });
