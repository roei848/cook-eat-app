import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";

import { ThemeColors } from "../../../theme/colors";
import { useThemeColors } from "../../../theme/useThemeColors";
import { Relative } from "../../../types/enums/relatives";

interface RelativesPickerProps {
  value: Relative[];
  onChange: (relatives: Relative[]) => void;
}

const ALL_RELATIVES = Object.values(Relative);

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
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
        {ALL_RELATIVES.map((relative) => {
          const isSelected = value.includes(relative);
          return (
            <TouchableOpacity
              key={relative}
              style={[styles.chip, isSelected && styles.chipSelected]}
              onPress={() => toggleRelative(relative)}
            >
              <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                {relative}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      marginBottom: 12,
    },
    label: {
      fontSize: 14,
      color: colors.text.secondary,
      marginBottom: 8,
    },
    chips: {
      flexDirection: "row",
      gap: 8,
      paddingVertical: 4,
    },
    chip: {
      paddingVertical: 8,
      paddingHorizontal: 14,
      borderRadius: 20,
      backgroundColor: colors.background.secondary,
      borderWidth: 1,
      borderColor: colors.border.default,
    },
    chipSelected: {
      backgroundColor: colors.primary[100],
      borderColor: colors.primary[500],
    },
    chipText: {
      fontSize: 13,
      color: colors.text.secondary,
    },
    chipTextSelected: {
      color: colors.primary[700],
      fontWeight: "600",
    },
  });
