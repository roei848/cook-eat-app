import React from "react";
import { TextInput, View, Text, StyleSheet, TextInputProps } from "react-native";

import { useThemeColors } from "../../theme/useThemeColors";
import { ThemeColors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { radius } from "../../theme/spacing";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export default function Input({ label, error, style, ...rest }: InputProps) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TextInput
        style={[styles.input, error ? styles.errorInput : null, style]}
        placeholderTextColor={colors.text.muted}
        {...rest}
      />

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      width: "100%",
      marginBottom: 16,
    },
    label: {
      marginBottom: 6,
      ...typography.label,
      color: colors.text.secondary,
    },
    input: {
      width: "100%",
      borderWidth: 1,
      borderColor: colors.border.default,
      borderRadius: radius.sm,
      padding: 14,
      ...typography.body,
      fontSize: 16,
      color: colors.text.primary,
      backgroundColor: colors.card.default,
    },
    errorInput: {
      borderColor: colors.danger[500],
    },
    error: {
      ...typography.bodySmall,
      color: colors.danger[500],
      marginTop: 4,
    },
  });
