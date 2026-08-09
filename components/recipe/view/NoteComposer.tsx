import React, { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useThemeColors } from "../../../theme/useThemeColors";
import { ThemeColors } from "../../../theme/colors";
import { typography } from "../../../theme/typography";
import { radius } from "../../../theme/spacing";
import ScalePressable from "../../ui/ScalePressable";

type Props = {
  onSubmit: (text: string) => void;
  onFocus: () => void;
};

export default function NoteComposer({ onSubmit, onFocus }: Props) {
  const colors = useThemeColors();
  const styles = createStyles(colors);
  const [text, setText] = useState("");

  const canSubmit = text.trim().length > 0;

  const submit = () => {
    if (!canSubmit) return;
    onSubmit(text);
    setText("");
  };

  return (
    <View style={styles.row}>
      <TextInput
        value={text}
        onChangeText={setText}
        onFocus={onFocus}
        placeholder="כתוב הערה..."
        placeholderTextColor={colors.text.muted}
        style={styles.input}
        multiline
        maxLength={500}
      />

      <ScalePressable
        onPress={submit}
        disabled={!canSubmit}
        haptic={canSubmit}
        accessibilityLabel="הוסף הערה"
        style={[styles.send, !canSubmit && styles.sendDisabled]}
      >
        <Ionicons name="arrow-up" size={20} color={colors.text.inverse} />
      </ScalePressable>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    row: {
      flexDirection: "row",
      alignItems: "flex-end",
      gap: 10,
      marginTop: 4,
    },
    input: {
      flex: 1,
      minHeight: 44,
      // Grows with the note, then scrolls internally.
      maxHeight: 120,
      backgroundColor: colors.background.secondary,
      borderRadius: radius.pill,
      paddingHorizontal: 16,
      paddingVertical: 12,
      ...typography.body,
      color: colors.text.primary,
      textAlign: "right",
    },
    send: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.primary[500],
      alignItems: "center",
      justifyContent: "center",
    },
    sendDisabled: {
      opacity: 0.4,
    },
  });
