import React from "react";
import { ActivityIndicator, StyleSheet, Text, View, ViewStyle } from "react-native";

import ScalePressable from "../ui/ScalePressable";
import GoogleLogo from "./GoogleLogo";
import { useThemeColors } from "../../theme/useThemeColors";
import { typography } from "../../theme/typography";
import { radius } from "../../theme/spacing";

interface GoogleSignInButtonProps {
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  title?: string;
  style?: ViewStyle;
}

/**
 * Secondary-styled sign-in button: card surface + border so it never
 * competes with the primary (orange) action, with the Google mark leading.
 */
export default function GoogleSignInButton({
  onPress,
  loading = false,
  disabled = false,
  title = "Continue with Google",
  style,
}: GoogleSignInButtonProps) {
  const colors = useThemeColors();
  const isDisabled = disabled || loading;

  return (
    <ScalePressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={[
        styles.button,
        {
          backgroundColor: colors.card.default,
          borderColor: colors.border.default,
          opacity: isDisabled && !loading ? 0.5 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.text.primary} />
      ) : (
        <View style={styles.content}>
          <GoogleLogo size={20} />
          <Text style={[styles.text, { color: colors.text.primary }]}>{title}</Text>
        </View>
      )}
    </ScalePressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    paddingVertical: 13,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  text: {
    ...typography.button,
  },
});
