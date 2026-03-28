import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

import { ThemeColors } from "../../../theme/colors";
import { useThemeColors } from "../../../theme/useThemeColors";
import { Relative } from "../../../types/enums/relatives";

interface RelativesPickerProps {
  value: Relative[];
  onChange: (relatives: Relative[]) => void;
}

const ALL_RELATIVES = Object.values(Relative);

const RELATIVE_EMOJI: Record<Relative, string> = {
  [Relative.VEGETARIAN]: "🌱",
  [Relative.VEGAN]: "🌿",
  [Relative.GLUTEN_FREE]: "🌾",
  [Relative.DAIRY_FREE]: "🥛",
  [Relative.DIET]: "🍃",
};

export default function RelativesPicker({ value, onChange }: RelativesPickerProps) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  function toggleRelative(relative: Relative) {
    if (value.includes(relative)) {
      onChange(value.filter((r) => r !== relative));
    } else {
      onChange([...value, relative]);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>תגיות תזונה (אופציונלי)</Text>
      <View style={styles.chips}>
        {ALL_RELATIVES.map((relative) => {
          const isSelected = value.includes(relative);
          return (
            <TouchableOpacity
              key={relative}
              style={[styles.chip, isSelected && styles.chipSelected]}
              onPress={() => toggleRelative(relative)}
              activeOpacity={0.7}
            >
              <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                {isSelected ? "✓ " : ""}
                {relative} {RELATIVE_EMOJI[relative]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      marginBottom: 12,
    },
    label: {
      fontSize: 12,
      color: colors.text.muted,
      marginBottom: 8,
      fontWeight: "500",
    },
    chips: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    chip: {
      paddingVertical: 9,
      paddingHorizontal: 14,
      borderRadius: 20,
      backgroundColor: colors.background.secondary,
      borderWidth: 1.5,
      borderColor: colors.border.default,
    },
    chipSelected: {
      backgroundColor: colors.accent.mintBg,
      borderWidth: 2,
      borderColor: colors.accent.mint,
    },
    chipText: {
      fontSize: 13,
      color: colors.text.secondary,
    },
    chipTextSelected: {
      color: colors.accent.mint,
      fontWeight: "600",
    },
  });
