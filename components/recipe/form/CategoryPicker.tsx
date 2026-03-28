import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from "react-native";
import { useSelector } from "react-redux";

import { ThemeColors } from "../../../theme/colors";
import { useThemeColors } from "../../../theme/useThemeColors";
import { RootState } from "../../../store/store";
import { Category } from "../../../types/enums/category";
import { CATEGORY_COLORS } from "../../../theme/categoryColors";

interface CategoryPickerProps {
  label?: string;
  value: Category;
  onChange: (category: Category) => void;
}

const CATEGORIES = Object.values(Category);

const CATEGORY_EMOJI: Record<Category, string> = {
  [Category.SOUP]: "🍵",
  [Category.SALAD]: "🥗",
  [Category.FIRST_COURSE]: "🍽️",
  [Category.SIDE]: "🍳",
  [Category.MAIN_COURSE]: "🔥",
  [Category.DESSERT]: "🧁",
  [Category.DRINK]: "🥤",
  [Category.OTHER]: "📦",
};

export default function CategoryPicker({
  label = "קטגוריה",
  value,
  onChange,
}: CategoryPickerProps) {
  const colors = useThemeColors();
  const { width: screenWidth } = useWindowDimensions();
  const cardWidth = (screenWidth - 32 - 8 * 3) / 4;
  const styles = createStyles(colors, cardWidth);
  const isDark = useSelector(
    (state: RootState) => state.user.profile?.darkMode ?? false
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.grid}>
        {CATEGORIES.map((cat) => {
          const isSelected = cat === value;
          const entry = CATEGORY_COLORS[cat];
          const selectedBg = isDark ? entry.dark : entry.light;
          return (
            <TouchableOpacity
              key={cat}
              style={[
                styles.card,
                isSelected
                  ? { backgroundColor: selectedBg, borderWidth: 0 }
                  : { backgroundColor: colors.card.default, borderWidth: 1.5, borderColor: colors.border.default },
              ]}
              onPress={() => onChange(cat)}
              activeOpacity={0.7}
            >
              <Text style={styles.emoji}>{CATEGORY_EMOJI[cat]}</Text>
              <Text
                style={[styles.cardLabel, isSelected && styles.cardLabelSelected]}
                numberOfLines={2}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const createStyles = (colors: ThemeColors, cardWidth: number) =>
  StyleSheet.create({
    container: {
      marginBottom: 16,
    },
    label: {
      fontSize: 12,
      color: colors.text.muted,
      marginBottom: 8,
      textAlign: "right",
      fontWeight: "500",
    },
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    card: {
      width: cardWidth,
      borderRadius: 14,
      paddingVertical: 10,
      paddingHorizontal: 4,
      alignItems: "center",
    },
    emoji: {
      fontSize: 20,
      marginBottom: 4,
    },
    cardLabel: {
      fontSize: 10,
      color: colors.text.secondary,
      textAlign: "center",
    },
    cardLabelSelected: {
      color: "#FFFFFF",
      fontWeight: "700",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 3,
    },
  });
