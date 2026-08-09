import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { ThemeColors } from "../../../theme/colors";
import { useThemeColors } from "../../../theme/useThemeColors";
import { Difficulty } from "../../../types/enums/diffucalty";
import { typography } from "../../../theme/typography";
import { radius, spacing } from "../../../theme/spacing";
import ScalePressable from "../../ui/ScalePressable";

interface DifficultyPickerProps {
  label?: string;
  /** Undefined renders no selection (AI review flow). */
  value?: Difficulty;
  onChange: (difficulty: Difficulty) => void;
}

const DIFFICULTIES = Object.values(Difficulty);

type DifficultyEntry = {
  icon: string;
  getBg: (c: ThemeColors) => string;
  getBorder: (c: ThemeColors) => string;
  getTextColor: (c: ThemeColors) => string;
};

const DIFFICULTY_CONFIG: Record<Difficulty, DifficultyEntry> = {
  [Difficulty.EASY]: {
    icon: "sunny",
    getBg: (c) => c.accent.mintBg,
    getBorder: (c) => c.accent.mint,
    getTextColor: (c) => c.accent.mintText,
  },
  [Difficulty.MEDIUM]: {
    icon: "flash",
    getBg: (c) => c.accent.amberBg,
    getBorder: (c) => c.accent.amber,
    getTextColor: (c) => c.accent.amberText,
  },
  [Difficulty.HARD]: {
    icon: "flame",
    getBg: (c) => c.accent.coralBg,
    getBorder: (c) => c.accent.coral,
    getTextColor: (c) => c.accent.coralText,
  },
};

export default function DifficultyPicker({
  label = "רמת קושי",
  value,
  onChange,
}: DifficultyPickerProps) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        {DIFFICULTIES.map((diff) => {
          const isSelected = diff === value;
          const config = DIFFICULTY_CONFIG[diff];
          return (
            <ScalePressable
              key={diff}
              onPress={() => onChange(diff)}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              style={[
                styles.tile,
                isSelected && {
                  backgroundColor: config.getBg(colors),
                  borderColor: config.getBorder(colors),
                },
              ]}
            >
              <Ionicons
                name={(isSelected ? config.icon : `${config.icon}-outline`) as any}
                size={22}
                color={isSelected ? config.getBorder(colors) : colors.text.muted}
              />
              <Text
                style={[
                  styles.tileLabel,
                  isSelected && { color: config.getTextColor(colors) },
                ]}
              >
                {diff}
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
    row: {
      flexDirection: "row",
      gap: spacing.sm,
    },
    tile: {
      flex: 1,
      borderRadius: radius.md,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.sm,
      alignItems: "center",
      gap: spacing.xs,
      backgroundColor: colors.card.default,
      borderWidth: 1.5,
      borderColor: colors.border.default,
    },
    tileLabel: {
      ...typography.label,
      color: colors.text.secondary,
      textAlign: "center",
    },
  });
