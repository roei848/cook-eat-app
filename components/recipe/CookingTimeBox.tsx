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
    <View style={styles.container}>
      <View style={styles.icon}>
        <Ionicons name="time-outline" size={14} color="#fff" />
      </View>
      <Text style={[styles.text, { color: colors.text.secondary }]}>
        {minutes} דקות
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#4CAF50", // green
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
  },
  text: {
    fontSize: 12,
    fontWeight: "500",
  },
});
