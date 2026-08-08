import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Category } from "../../../types/enums/category";
import { CATEGORY_COLORS } from "../../../theme/categoryColors";
import { typography } from "../../../theme/typography";
import { radius } from "../../../theme/spacing";

/**
 * On-photo variant of the category chip: a translucent dark scrim keeps
 * it legible over any hero photo and identical in both themes (the photo
 * underneath doesn't change with the theme, so the chip shouldn't either).
 */
export default function RecipeCategoryBadge({
  category,
}: {
  category: Category;
}) {
  const entry = CATEGORY_COLORS[category];

  return (
    <View style={styles.badge}>
      <Ionicons name={entry.icon as any} size={13} color="#FFFFFF" />
      <Text style={styles.label}>{category}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  label: {
    ...typography.label,
    fontSize: 12,
    color: "#FFFFFF",
  },
});
