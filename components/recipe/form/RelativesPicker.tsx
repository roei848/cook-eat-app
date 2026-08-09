import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { ThemeColors } from "../../../theme/colors";
import { useThemeColors } from "../../../theme/useThemeColors";
import { Relative } from "../../../types/enums/relatives";
import { typography } from "../../../theme/typography";
import { radius, spacing } from "../../../theme/spacing";
import ScalePressable from "../../ui/ScalePressable";

interface RelativesPickerProps {
  value: Relative[];
  onChange: (relatives: Relative[]) => void;
}

const ALL_RELATIVES = Object.values(Relative);

const RELATIVE_ICONS: Record<Relative, string> = {
  [Relative.VEGETARIAN]: "leaf",
  [Relative.VEGAN]: "flower",
  [Relative.GLUTEN_FREE]: "ban",
  [Relative.DAIRY_FREE]: "pint",
  [Relative.DIET]: "fitness",
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
      <View style={styles.labelRow}>
        <Text style={styles.label}>תגיות תזונה</Text>
        <Text style={styles.optionalHint}>אופציונלי</Text>
      </View>
      <View style={styles.chips}>
        {ALL_RELATIVES.map((relative) => {
          const isSelected = value.includes(relative);
          const icon = RELATIVE_ICONS[relative];
          return (
            <ScalePressable
              key={relative}
              onPress={() => toggleRelative(relative)}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              style={[styles.chip, isSelected && styles.chipSelected]}
            >
              <Ionicons
                name={(isSelected ? icon : `${icon}-outline`) as any}
                size={15}
                color={isSelected ? colors.accent.mint : colors.text.muted}
              />
              <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                {relative}
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
      marginBottom: spacing.md,
    },
    labelRow: {
      flexDirection: "row",
      alignItems: "baseline",
      gap: spacing.xs,
      marginBottom: 6,
    },
    label: {
      ...typography.label,
      color: colors.text.secondary,
    },
    optionalHint: {
      ...typography.caption,
      color: colors.text.muted,
    },
    chips: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: spacing.sm,
    },
    chip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingVertical: 8,
      paddingHorizontal: 14,
      borderRadius: radius.pill,
      backgroundColor: colors.card.default,
      borderWidth: 1.5,
      borderColor: colors.border.default,
    },
    chipSelected: {
      backgroundColor: colors.accent.mintBg,
      borderColor: colors.accent.mint,
    },
    chipText: {
      ...typography.label,
      color: colors.text.secondary,
    },
    chipTextSelected: {
      color: colors.accent.mintText,
    },
  });
