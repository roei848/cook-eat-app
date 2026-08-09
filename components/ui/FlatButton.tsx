import React from "react";
import { Text, StyleSheet, ViewStyle } from "react-native";

import { useThemeColors } from "../../theme/useThemeColors";
import { fonts, typography } from "../../theme/typography";
import ScalePressable from "./ScalePressable";

interface FlatButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: any;
}

export default function FlatButton({
  title,
  onPress,
  disabled = false,
  style,
  textStyle,
}: FlatButtonProps) {
  const colors = useThemeColors();

  return (
    <ScalePressable
      onPress={onPress}
      disabled={disabled}
      scaleTo={0.97}
      style={[styles.container, style]}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
    >
      <Text
        style={[styles.text, { color: colors.primary[500] }, textStyle]}
      >
        {title}
      </Text>
    </ScalePressable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 6,
  },
  text: {
    ...typography.body,
    fontFamily: fonts.bodyMedium,
  },
});
