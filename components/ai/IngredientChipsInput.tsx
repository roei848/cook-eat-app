import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { ThemeColors } from "../../theme/colors";
import { useThemeColors } from "../../theme/useThemeColors";
import { typography } from "../../theme/typography";
import { radius, spacing } from "../../theme/spacing";
import { MAX_CHIP_CHARS } from "../../types/aiIdeas";
import ScalePressable from "../ui/ScalePressable";

interface IngredientChipsInputProps {
  value: string[];
  /** Quick-add staples; ones already in `value` are hidden. */
  suggestions: string[];
  error?: string;
  onAdd: (name: string) => void;
  onRemove: (name: string) => void;
}

/**
 * "What's in my fridge" entry: type-and-return or tap a staple to add a chip,
 * tap a chip to remove it. Validation (dedupe, caps) lives in the container.
 */
export default function IngredientChipsInput({
  value,
  suggestions,
  error,
  onAdd,
  onRemove,
}: IngredientChipsInputProps) {
  const colors = useThemeColors();
  const styles = createStyles(colors);
  const [draft, setDraft] = useState("");

  function submitDraft() {
    if (!draft.trim()) return;
    onAdd(draft);
    setDraft("");
  }

  const remainingSuggestions = suggestions.filter((name) => !value.includes(name));

  return (
    <View style={styles.container}>
      <Text style={styles.label}>המצרכים שלי</Text>

      <View style={[styles.inputRow, error ? styles.inputRowError : null]}>
        <TextInput
          style={styles.input}
          value={draft}
          onChangeText={setDraft}
          onSubmitEditing={submitDraft}
          // Keep focus so several ingredients can be typed in a row
          submitBehavior="submit"
          returnKeyType="done"
          maxLength={MAX_CHIP_CHARS}
          placeholder="למשל: ביצים"
          placeholderTextColor={colors.text.muted}
          autoCorrect={false}
        />
        <ScalePressable
          onPress={submitDraft}
          disabled={!draft.trim()}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="הוספת מצרך"
        >
          <Ionicons
            name="add-circle"
            size={28}
            color={draft.trim() ? colors.primary[500] : colors.text.muted}
          />
        </ScalePressable>
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {value.length > 0 && (
        <View style={styles.chips}>
          {value.map((name) => (
            <ScalePressable
              key={name}
              onPress={() => onRemove(name)}
              style={styles.chip}
              accessibilityRole="button"
              accessibilityLabel={`הסרת ${name}`}
            >
              <Text style={styles.chipText}>{name}</Text>
              <Ionicons name="close-circle" size={16} color={colors.accent.mint} />
            </ScalePressable>
          ))}
        </View>
      )}

      {remainingSuggestions.length > 0 && (
        <View style={styles.suggestions}>
          <Text style={styles.suggestionsLabel}>הוספה מהירה</Text>
          <View style={styles.chips}>
            {remainingSuggestions.map((name) => (
              <ScalePressable
                key={name}
                onPress={() => onAdd(name)}
                style={styles.suggestionChip}
                accessibilityRole="button"
                accessibilityLabel={`הוספת ${name}`}
              >
                <Ionicons name="add" size={14} color={colors.text.muted} />
                <Text style={styles.suggestionText}>{name}</Text>
              </ScalePressable>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      marginBottom: spacing.lg,
    },
    label: {
      ...typography.label,
      color: colors.text.secondary,
      marginBottom: 6,
    },
    inputRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      backgroundColor: colors.card.default,
      borderWidth: 1.5,
      borderColor: colors.border.default,
      borderRadius: radius.sm,
      paddingStart: 14,
      paddingEnd: spacing.sm,
    },
    inputRowError: {
      borderColor: colors.danger[500],
    },
    input: {
      flex: 1,
      ...typography.body,
      fontSize: 16,
      color: colors.text.primary,
      paddingVertical: 12,
    },
    error: {
      ...typography.bodySmall,
      color: colors.danger[500],
      marginTop: 4,
    },
    chips: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: spacing.sm,
      marginTop: spacing.md,
    },
    chip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: radius.pill,
      backgroundColor: colors.accent.mintBg,
      borderWidth: 1.5,
      borderColor: colors.accent.mint,
    },
    chipText: {
      ...typography.label,
      color: colors.accent.mintText,
    },
    suggestions: {
      marginTop: spacing.lg,
    },
    suggestionsLabel: {
      ...typography.caption,
      color: colors.text.muted,
    },
    suggestionChip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: radius.pill,
      backgroundColor: colors.card.default,
      borderWidth: 1.5,
      borderColor: colors.border.default,
    },
    suggestionText: {
      ...typography.label,
      color: colors.text.secondary,
    },
  });
