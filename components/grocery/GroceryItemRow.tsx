import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { GroceryItem } from "../../types/grocery";
import { useThemeColors } from "../../theme/useThemeColors";
import { ThemeColors } from "../../theme/colors";

interface Props {
  item: GroceryItem;
  onToggle: () => void;
  onDelete: () => void;
}

export default function GroceryItemRow({ item, onToggle, onDelete }: Props) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  return (
    <Pressable style={styles.row} onPress={onToggle}>
      <Ionicons
        name={item.checked ? "checkmark-circle" : "ellipse-outline"}
        size={26}
        color={item.checked ? colors.primary[500] : colors.text.muted}
      />

      <View style={styles.textContainer}>
        <Text style={[styles.name, item.checked && styles.nameChecked]}>
          {item.name}
        </Text>
        {item.amount ? (
          <Text style={styles.amount}>{item.amount}</Text>
        ) : null}
      </View>

      <Pressable onPress={onDelete} hitSlop={8}>
        <Ionicons name="trash-outline" size={20} color={colors.danger[500]} />
      </Pressable>
    </Pressable>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      backgroundColor: colors.card.default,
      borderRadius: 16,
      paddingHorizontal: 16,
      paddingVertical: 14,
      marginBottom: 10,
    },
    textContainer: {
      flex: 1,
    },
    name: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text.primary,
    },
    nameChecked: {
      textDecorationLine: "line-through",
      color: colors.text.muted,
      fontWeight: "400",
    },
    amount: {
      fontSize: 12,
      color: colors.text.muted,
      marginTop: 2,
    },
  });
