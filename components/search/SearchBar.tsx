import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useThemeColors } from "../../theme/useThemeColors";
import { ThemeColors } from "../../theme/colors";

type SearchBarProps = {
  value: string;
  placeholder?: string;
  onChangeText: (text: string) => void;
};

export default function SearchBar({
  value,
  placeholder = "חיפוש מתכונים...",
  onChangeText,
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
        autoFocus
      />
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 12,
      paddingHorizontal: 20,
      paddingVertical: 8,
      backgroundColor: colors.background.secondary,
      borderWidth: 1,
      borderColor: colors.border.default,
      marginHorizontal: 20,
      marginVertical: 10,
    },
    icon: {
      marginRight: 8,
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: colors.text.primary,
    },
  });
