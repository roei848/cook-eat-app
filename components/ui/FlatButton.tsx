import React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from "react-native";

import { useThemeColors } from "../../theme/useThemeColors";
import { fonts, typography } from "../../theme/typography";

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
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.container, style]}
      activeOpacity={0.6}
    >
      <Text
        style={[styles.text, { color: colors.primary[500] }, textStyle]}
      >
        {title}
      </Text>
    </TouchableOpacity>
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
