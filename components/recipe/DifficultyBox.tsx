import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Difficulty } from "../../types/enums/diffucalty";

type Props = {
  difficulty: Difficulty;
};

const DIFFICULTY_CONFIG: Record<
  Difficulty,
  { label: string; emoji: string; color: string }
> = {
  [Difficulty.EASY]: {
    label: Difficulty.EASY,
    emoji: "😊",
    color: "#4CAF50",
  },
  [Difficulty.MEDIUM]: {
    label: Difficulty.MEDIUM,
    emoji: "😐",
    color: "#FF9800",
  },
  [Difficulty.HARD]: {
    label: Difficulty.HARD,
    emoji: "😤",
    color: "#F44336",
  },
};

export default function DifficultyBox({ difficulty }: Props) {
  const config = DIFFICULTY_CONFIG[difficulty];

  return (
    <View style={[styles.container, { backgroundColor: config.color + "22" }]}>
      <Text style={styles.emoji}>{config.emoji}</Text>
      <Text style={[styles.text, { color: config.color }]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  emoji: {
    fontSize: 14,
    marginRight: 4,
  },
  text: {
    fontSize: 12,
    fontWeight: "600",
  },
});
