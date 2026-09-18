import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

import ScalePressable from "../ui/ScalePressable";
import { CategorySummary } from "../../store/selectors/categorySelectors";
import { CATEGORY_COLORS, withAlpha } from "../../theme/categoryColors";
import { useThemeColors } from "../../theme/useThemeColors";
import { typography } from "../../theme/typography";
import { radius, spacing } from "../../theme/spacing";
import { RootState } from "../../store/store";

type Props = {
  summary: CategorySummary;
  size: "full" | "half";
  /** Global tile index (0–7) driving the entrance stagger. */
  index: number;
  onPress: () => void;
};

const countLabel = (count: number): string => {
  if (count === 0) return "עוד אין מתכונים";
  if (count === 1) return "מתכון אחד";
  return `${count} מתכונים`;
};

/**
 * Category tile: a softly tinted surface with the category icon, name and
 * recipe count. Deliberately never shows a recipe photo — a single imported
 * recipe would otherwise take over the whole category's tile.
 */
export default function CategoryTile({ summary, size, index, onPress }: Props) {
  const colors = useThemeColors();
  const isDark = useSelector(
    (state: RootState) => state.user.profile?.darkMode ?? false
  );
  const entry = CATEGORY_COLORS[summary.category];

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 60).springify().damping(18)}
      style={size === "full" ? styles.fullWrap : styles.halfWrap}
    >
      <ScalePressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`${summary.category}, ${countLabel(summary.count)}`}
        style={[
          styles.tile,
          size === "full" ? styles.fullTile : styles.halfTile,
          {
            backgroundColor: isDark
              ? withAlpha(entry.dark, 0.45)
              : withAlpha(entry.light, 0.16),
          },
        ]}
      >
        <View style={styles.content}>
          <Ionicons
            name={entry.icon as any}
            size={size === "full" ? 52 : 44}
            color={isDark ? withAlpha("#FFFFFF", 0.85) : entry.light}
          />
          <Text
            style={[
              size === "full" ? typography.displayM : typography.displayS,
              { color: colors.text.primary },
            ]}
            numberOfLines={1}
          >
            {summary.category}
          </Text>
          <Text style={[typography.caption, { color: colors.text.secondary }]}>
            {countLabel(summary.count)}
          </Text>
        </View>
      </ScalePressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  fullWrap: {
    width: "100%",
  },
  halfWrap: {
    flex: 1,
  },
  tile: {
    borderRadius: radius.md,
    overflow: "hidden",
  },
  fullTile: {
    aspectRatio: 16 / 9,
  },
  halfTile: {
    aspectRatio: 1,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    padding: spacing.md,
  },
});
