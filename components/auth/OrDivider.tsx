import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";

import { useThemeColors } from "../../theme/useThemeColors";
import { typography } from "../../theme/typography";

export default function OrDivider({
  label = "or",
  style,
}: {
  label?: string;
  style?: ViewStyle;
}) {
  const colors = useThemeColors();
  return (
    <View style={[styles.row, style]}>
      <View style={[styles.line, { backgroundColor: colors.border.default }]} />
      <Text style={[styles.label, { color: colors.text.muted }]}>{label}</Text>
      <View style={[styles.line, { backgroundColor: colors.border.default }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  line: {
    flex: 1,
    height: StyleSheet.hairlineWidth * 2,
  },
  label: {
    ...typography.caption,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});
