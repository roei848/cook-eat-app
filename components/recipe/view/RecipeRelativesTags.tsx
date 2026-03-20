import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Relative } from "../../../types/enums/relatives";
import { useThemeColors } from "../../../theme/useThemeColors";
import { ThemeColors } from "../../../theme/colors";

export default function RecipeRelativesTags({ relatives }: { relatives: Relative[] }) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  if (!relatives || relatives.length === 0) return null;

  return (
    <View style={styles.row}>
      {relatives.map((tag) => (
        <View key={tag} style={styles.pill}>
          <Text style={styles.pillText}>{tag}</Text>
        </View>
      ))}
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    row: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginTop: 12,
    },
    pill: {
      backgroundColor: colors.primary[100],
      borderRadius: 12,
      paddingHorizontal: 10,
      paddingVertical: 4,
    },
    pillText: {
      color: colors.primary[700],
      fontSize: 12,
      fontWeight: "600",
    },
  });
