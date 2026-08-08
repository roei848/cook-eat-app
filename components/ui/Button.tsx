import React from "react";
import { Text, StyleSheet, ActivityIndicator, ViewStyle } from "react-native";

import ScalePressable from "./ScalePressable";
import { useThemeColors } from "../../theme/useThemeColors";
import { withAlpha } from "../../theme/categoryColors";
import { typography } from "../../theme/typography";
import { radius } from "../../theme/spacing";

interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export default function Button({
  title,
  onPress,
  loading = false,
  disabled = false,
  style,
}: ButtonProps) {
  const colors = useThemeColors();
  const isDisabled = disabled || loading;

  return (
    <ScalePressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={[
        styles.button,
        {
          backgroundColor: isDisabled
            ? withAlpha(colors.primary[500], 0.4)
            : colors.primary[500],
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.text.inverse} />
      ) : (
        <Text style={[styles.text, { color: colors.text.inverse }]}>
          {title}
        </Text>
      )}
    </ScalePressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    ...typography.button,
  },
});
