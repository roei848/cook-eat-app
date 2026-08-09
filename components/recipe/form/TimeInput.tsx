import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { ThemeColors } from "../../../theme/colors";
import { useThemeColors } from "../../../theme/useThemeColors";
import { typography } from "../../../theme/typography";
import { radius } from "../../../theme/spacing";

interface TimeInputProps {
  /** Minutes as a string (containers own the number parsing). */
  value: string;
  onChange: (text: string) => void;
  label?: string;
  error?: string;
  /** Amber "needs completion" state (AI review flow). Error wins over it. */
  missing?: boolean;
}

export default function TimeInput({
  value,
  onChange,
  label = "זמן הכנה",
  error,
  missing,
}: TimeInputProps) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[
          styles.field,
          missing && !error ? styles.fieldMissing : null,
          error ? styles.fieldError : null,
        ]}
      >
        <Ionicons name="time-outline" size={20} color={colors.text.muted} />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChange}
          placeholder="למשל 45"
          placeholderTextColor={colors.text.muted}
          keyboardType="number-pad"
        />
        <Text style={styles.unit}>דקות</Text>
      </View>
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
      ...typography.label,
      color: colors.text.secondary,
      marginBottom: 6,
    },
    field: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      backgroundColor: colors.card.default,
      borderWidth: 1.5,
      borderColor: colors.border.default,
      borderRadius: radius.sm,
      paddingVertical: 10,
      paddingHorizontal: 14,
    },
    fieldMissing: {
      backgroundColor: colors.accent.amberBg,
      borderColor: colors.accent.amber,
    },
    fieldError: {
      borderColor: colors.danger[500],
    },
    input: {
      flex: 1,
      ...typography.body,
      fontSize: 16,
      color: colors.text.primary,
      paddingVertical: 4,
    },
    unit: {
      ...typography.caption,
      color: colors.text.muted,
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
