import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Category } from "../../../types/enums/category";
import { CATEGORY_COLORS } from "../../../theme/categoryColors";
import { useThemeColors } from "../../../theme/useThemeColors";
import { ThemeColors } from "../../../theme/colors";

export default function RecipeCategoryBadge({ category }: { category: Category }) {
  const colors = useThemeColors();
  const styles = createStyles(colors);
  const entry = CATEGORY_COLORS[category];
  const bg = entry.light;

  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Ionicons name={entry.icon as any} size={13} color="#FFFFFF" />
      <Text style={styles.label}>{category}</Text>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    badge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      borderRadius: 12,
      paddingHorizontal: 10,
      paddingVertical: 5,
    },
    label: {
      color: "#FFFFFF",
      fontSize: 12,
      fontWeight: "600",
    },
  });
