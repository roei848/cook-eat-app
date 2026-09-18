import React from "react";
import { StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useThemeColors } from "../../theme/useThemeColors";
import { withAlpha } from "../../theme/categoryColors";
import { radius } from "../../theme/spacing";
import ScalePressable from "./ScalePressable";

interface BackButtonProps {
  onPress: () => void;
  disabled?: boolean;
}

/**
 * Tinted chevron pill — the in-screen back affordance shared by the wizard
 * progress bar and the URL import screen.
 */
export default function BackButton({ onPress, disabled = false }: BackButtonProps) {
  const colors = useThemeColors();

  return (
    <ScalePressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={8}
      style={[
        styles.button,
        {
          backgroundColor: withAlpha(colors.primary[500], 0.1),
          opacity: disabled ? 0.5 : 1,
        },
      ]}
      accessibilityRole="button"
      accessibilityLabel="חזרה"
      accessibilityState={{ disabled }}
    >
      {/* chevron-forward = back under forced RTL */}
      <Ionicons name="chevron-forward" size={20} color={colors.primary[500]} />
    </ScalePressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
});
