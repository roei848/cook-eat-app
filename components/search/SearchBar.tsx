import React from "react";
import { View, TextInput, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useThemeColors } from "../../theme/useThemeColors";
import { ThemeColors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { radius, SCREEN_PADDING_H } from "../../theme/spacing";

type SearchBarProps = {
  value: string;
  placeholder?: string;
  onChangeText: (text: string) => void;
  autoFocus?: boolean;
};

export default function SearchBar({
  value,
  placeholder = "חיפוש מתכונים...",
  onChangeText,
  autoFocus = false,
}: SearchBarProps) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <Ionicons
        name="search"
        size={20}
        color={colors.text.muted}
        style={styles.icon}
      />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.text.muted}
        style={styles.input}
        autoFocus={autoFocus}
        returnKeyType="search"
      />
      {value.length > 0 && (
        <Pressable
          onPress={() => onChangeText("")}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="נקה חיפוש"
        >
          <Ionicons
            name="close-circle"
            size={20}
            color={colors.text.muted}
          />
        </Pressable>
      )}
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: radius.md,
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.card.default,
      borderWidth: 1.5,
      borderColor: colors.border.default,
      marginHorizontal: SCREEN_PADDING_H,
      marginBottom: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 6,
      elevation: 2,
    },
    icon: {
      marginEnd: 10,
    },
    input: {
      flex: 1,
      ...typography.body,
      fontSize: 16,
      color: colors.text.primary,
      paddingVertical: 0,
    },
  });
