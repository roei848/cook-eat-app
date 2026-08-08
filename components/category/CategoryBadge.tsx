import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";

import { Category } from "../../types/enums/category";
import { CATEGORY_COLORS, withAlpha } from "../../theme/categoryColors";
import { typography } from "../../theme/typography";
import { radius } from "../../theme/spacing";
import { RootState } from "../../store/store";

type Props = {
  category: Category;
  /** Show the category icon before the label. Default true. */
  withIcon?: boolean;
};

/**
 * The "demoted rainbow" treatment: category color as a soft tint chip,
 * never a full-saturation surface. Light mode tints the light shade and
 * uses the dark shade for text; dark mode inverts that.
 */
export default function CategoryBadge({ category, withIcon = true }: Props) {
  const isDark = useSelector(
    (state: RootState) => state.user.profile?.darkMode ?? false
  );
  const entry = CATEGORY_COLORS[category];
  const background = isDark
    ? withAlpha(entry.dark, 0.5)
    : withAlpha(entry.light, 0.16);
  const foreground = isDark ? entry.light : entry.dark;

  return (
    <View style={[styles.badge, { backgroundColor: background }]}>
      {withIcon && (
        <Ionicons name={entry.icon as any} size={13} color={foreground} />
      )}
      <Text style={[typography.label, { color: foreground }]}>{category}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 4,
    borderRadius: radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
});
