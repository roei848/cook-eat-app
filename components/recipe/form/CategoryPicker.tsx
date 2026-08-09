import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";

import { ThemeColors } from "../../../theme/colors";
import { useThemeColors } from "../../../theme/useThemeColors";
import { RootState } from "../../../store/store";
import { Category } from "../../../types/enums/category";
import { CATEGORY_COLORS, withAlpha } from "../../../theme/categoryColors";
import { typography } from "../../../theme/typography";
import { radius, spacing } from "../../../theme/spacing";
import ScalePressable from "../../ui/ScalePressable";

interface CategoryPickerProps {
  label?: string;
  /** Undefined renders no selection (AI review flow). */
  value?: Category;
  onChange: (category: Category) => void;
}

const CATEGORIES = Object.values(Category);

const COLUMNS = 4;
const GRID_GAP = spacing.sm;

export default function CategoryPicker({
  label = "קטגוריה",
  value,
  onChange,
}: CategoryPickerProps) {
  const colors = useThemeColors();
  const styles = createStyles(colors);
  const isDark = useSelector(
    (state: RootState) => state.user.profile?.darkMode ?? false
  );

  // Measured so the 4-column math works in any container (screen gutter
  // or inside a section card) — percentage flexBasis is unreliable here.
  const [gridWidth, setGridWidth] = useState(0);
  const tileWidth =
    gridWidth > 0 ? (gridWidth - GRID_GAP * (COLUMNS - 1)) / COLUMNS : undefined;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={styles.grid}
        onLayout={(e) => setGridWidth(e.nativeEvent.layout.width)}
      >
        {CATEGORIES.map((cat) => {
          const isSelected = cat === value;
          const entry = CATEGORY_COLORS[cat];
          // Demoted rainbow: soft tint surface, foreground hue for icon/label
          const tint = isDark
            ? withAlpha(entry.dark, 0.5)
            : withAlpha(entry.light, 0.16);
          const foreground = isDark ? entry.light : entry.dark;
          const iconName = isSelected
            ? (entry.icon.replace("-outline", "") as typeof entry.icon)
            : entry.icon;

          return (
            <ScalePressable
              key={cat}
              onPress={() => onChange(cat)}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              style={[
                styles.tile,
                tileWidth != null && { width: tileWidth },
                isSelected && { backgroundColor: tint, borderColor: foreground },
              ]}
            >
              <Ionicons
                name={iconName as any}
                size={22}
                color={isSelected ? foreground : colors.text.muted}
              />
              <Text
                style={[styles.tileLabel, isSelected && { color: foreground }]}
                numberOfLines={2}
              >
                {cat}
              </Text>
            </ScalePressable>
          );
        })}
      </View>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      marginBottom: spacing.lg,
    },
    label: {
      ...typography.label,
      color: colors.text.secondary,
      marginBottom: 6,
    },
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: GRID_GAP,
    },
    tile: {
      minHeight: 76,
      borderRadius: radius.md,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.xs,
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.xs,
      backgroundColor: colors.card.default,
      borderWidth: 1.5,
      borderColor: colors.border.default,
    },
    tileLabel: {
      ...typography.caption,
      color: colors.text.secondary,
      textAlign: "center",
    },
  });
