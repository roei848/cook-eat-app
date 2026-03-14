import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Difficulty } from "../../types/enums/diffucalty";
import { useThemeColors } from "../../theme/useThemeColors";
import { ThemeColors } from "../../theme/colors";

type Props = {
  difficulty: Difficulty;
};

type DifficultyEntry = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  getBg: (c: ThemeColors) => string;
  getColor: (c: ThemeColors) => string;
};

const DIFFICULTY_CONFIG: Record<Difficulty, DifficultyEntry> = {
  [Difficulty.EASY]: {
    label: Difficulty.EASY,
    icon: "sunny-outline",
    getBg: (c) => c.accent.mintBg,
    getColor: (c) => c.accent.mint,
  },
  [Difficulty.MEDIUM]: {
    label: Difficulty.MEDIUM,
    icon: "flash-outline",
    getBg: (c) => c.accent.amberBg,
    getColor: (c) => c.accent.amber,
  },
  [Difficulty.HARD]: {
    label: Difficulty.HARD,
    icon: "flame-outline",
    getBg: (c) => c.accent.coralBg,
    getColor: (c) => c.accent.coral,
  },
};

export default function DifficultyBox({ difficulty }: Props) {
  const colors = useThemeColors();
  const config = DIFFICULTY_CONFIG[difficulty];
  const bg = config.getBg(colors);
  const color = config.getColor(colors);

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <Ionicons name={config.icon} size={13} color={color} />
      <Text style={[styles.text, { color }]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
  },
  text: {
    fontSize: 12,
    fontWeight: "600",
  },
});
