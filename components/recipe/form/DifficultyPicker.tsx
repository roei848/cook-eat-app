import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

import { ThemeColors } from "../../../theme/colors";
import { useThemeColors } from "../../../theme/useThemeColors";
import { Difficulty } from "../../../types/enums/diffucalty";

interface DifficultyPickerProps {
  label?: string;
  value: Difficulty;
  onChange: (difficulty: Difficulty) => void;
}

const DIFFICULTIES = Object.values(Difficulty);

type DifficultyEntry = {
  emoji: string;
  getBg: (c: ThemeColors) => string;
  getBorder: (c: ThemeColors) => string;
  getTextColor: (c: ThemeColors) => string;
};

const DIFFICULTY_CONFIG: Record<Difficulty, DifficultyEntry> = {
  [Difficulty.EASY]: {
    emoji: "☀️",
    getBg: (c) => c.accent.mintBg,
    getBorder: (c) => c.accent.mint,
    getTextColor: (c) => c.accent.mint,
  },
  [Difficulty.MEDIUM]: {
    emoji: "⚡",
    getBg: (c) => c.accent.amberBg,
    getBorder: (c) => c.accent.amber,
    getTextColor: (c) => c.accent.amber,
  },
  [Difficulty.HARD]: {
    emoji: "🔥",
    getBg: (c) => c.accent.coralBg,
    getBorder: (c) => c.accent.coral,
    getTextColor: (c) => c.accent.coral,
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
            <TouchableOpacity
              key={diff}
              style={[
                styles.card,
                isSelected && {
                  backgroundColor: config.getBg(colors),
                  borderColor: config.getBorder(colors),
                  borderWidth: 2,
                },
              ]}
              onPress={() => onChange(diff)}
              activeOpacity={0.7}
            >
              <Text style={styles.emoji}>{config.emoji}</Text>
              <Text
                style={[
                  styles.cardLabel,
                  isSelected && {
                    color: config.getTextColor(colors),
                    fontWeight: "700",
                  },
                ]}
              >
                {diff}
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
      marginBottom: 16,
    },
    label: {
      fontSize: 12,
      color: colors.text.muted,
      marginBottom: 8,
      textAlign: "right",
      fontWeight: "500",
    },
    row: {
      flexDirection: "row",
      gap: 8,
    },
    card: {
      flex: 1,
      borderRadius: 14,
      paddingVertical: 12,
      paddingHorizontal: 8,
      alignItems: "center",
      backgroundColor: colors.card.default,
      borderWidth: 1.5,
      borderColor: colors.border.default,
    },
    emoji: {
      fontSize: 20,
      marginBottom: 4,
    },
    cardLabel: {
      fontSize: 12,
      color: colors.text.secondary,
      textAlign: "center",
    },
  });
