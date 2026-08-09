import React from "react";
import { TextInput, View, Text, StyleSheet, TextInputProps } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useThemeColors } from "../../theme/useThemeColors";
import { ThemeColors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { radius } from "../../theme/spacing";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  /** Amber "needs completion" state (AI review flow). Error wins over it. */
  missing?: boolean;
}

export default function Input({ label, error, missing, style, ...rest }: InputProps) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TextInput
        style={[
          styles.input,
          missing && !error ? styles.missingInput : null,
          error ? styles.errorInput : null,
          style,
        ]}
        placeholderTextColor={colors.text.muted}
        {...rest}
      />

      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : missing ? (
        <View style={styles.missingRow}>
          <Ionicons name="alert-circle-outline" size={14} color={colors.accent.amberText} />
          <Text style={styles.missingText}>שדה חובה</Text>
        </View>
      ) : null}
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
      borderWidth: 1.5,
      borderColor: colors.border.default,
      borderRadius: radius.sm,
      padding: 14,
      ...typography.body,
      fontSize: 16,
      color: colors.text.primary,
      backgroundColor: colors.card.default,
    },
    missingInput: {
      backgroundColor: colors.accent.amberBg,
      borderColor: colors.accent.amber,
    },
    errorInput: {
      borderColor: colors.danger[500],
    },
    error: {
      ...typography.bodySmall,
      color: colors.danger[500],
      marginTop: 4,
    },
    missingRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      marginTop: 4,
    },
    missingText: {
      ...typography.caption,
      color: colors.accent.amberText,
    },
  });
