import React from "react";
import { Pressable, Text } from "react-native";

import { useThemeColors } from "../../theme/useThemeColors";
import { fonts } from "../../theme/typography";

interface Props {
  label: string;
  onPress: () => void;
  /** Bold weight for the primary header action (e.g. שמור). */
  prominent?: boolean;
  disabled?: boolean;
}

/**
 * Plain Pressable on purpose — reanimated views inside native-stack header
 * subviews measure to zero width intermittently on Fabric, so no
 * ScalePressable here.
 */
export default function HeaderTextButton({
  label,
  onPress,
  prominent = false,
  disabled = false,
}: Props) {
  const colors = useThemeColors();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      style={({ pressed }) => ({
        marginHorizontal: 8,
        opacity: pressed ? 0.5 : 1,
      })}
    >
      <Text
        style={{
          fontFamily: prominent ? fonts.bodyBold : fonts.body,
          fontSize: 16,
          lineHeight: 22,
          color: disabled ? colors.text.muted : colors.primary[500],
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
