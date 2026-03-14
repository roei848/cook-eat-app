import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "../../theme/useThemeColors";

type Props = {
  minutes: number;
};

export default function CookingTimeBox({ minutes }: Props) {
  const colors = useThemeColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.accent.amberBg }]}>
      <Ionicons name="time-outline" size={13} color={colors.accent.amber} />
      <Text style={[styles.text, { color: colors.accent.amber }]}>
        {minutes} דק׳
      </Text>
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
