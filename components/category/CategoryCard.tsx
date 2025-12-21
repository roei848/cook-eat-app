import React from "react";

import { TouchableOpacity, StyleSheet, Text } from "react-native";

import { Category } from "../../types/enums/category";
import { useThemeColors } from "../../theme/useThemeColors";
import { ThemeColors } from "../../theme/colors";

type CategoryCardProps = {
  category: Category;
  onPress?: () => void;
};

export default function CategoryCard({
  category,
  onPress,
}: CategoryCardProps) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={styles.card}
    >
      <Text style={styles.label}>{category}</Text>
    </TouchableOpacity>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    card: {
      flex: 1,
      paddingVertical: 14,
      paddingHorizontal: 12,
      borderRadius: 12,
      backgroundColor: colors.card.default,
      borderWidth: 1,
      borderColor: colors.border.default,
      alignItems: "center",
      justifyContent: "center",
    },
    label: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.text.primary,
    },
  });


