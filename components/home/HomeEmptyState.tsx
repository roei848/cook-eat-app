import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Button from "../ui/Button";
import { useThemeColors } from "../../theme/useThemeColors";
import { typography } from "../../theme/typography";
import { SCREEN_PADDING_H, spacing } from "../../theme/spacing";

type Props = {
  onAddRecipe: () => void;
};

/** Warm empty state for a kitchen with no recipes yet. */
export default function HomeEmptyState({ onAddRecipe }: Props) {
  const colors = useThemeColors();

  return (
    <View style={styles.centered}>
      <View
        style={[
          styles.iconCircle,
          { backgroundColor: colors.background.secondary },
        ]}
      >
        <Ionicons
          name="restaurant-outline"
          size={34}
          color={colors.text.muted}
        />
      </View>
      <Text style={[styles.title, { color: colors.text.primary }]}>
        עוד אין מתכונים במטבח
      </Text>
      <Text style={[styles.hint, { color: colors.text.secondary }]}>
        המתכון המשפחתי הראשון שתוסיפו יופיע כאן
      </Text>
      <Button title="הוסיפו מתכון" onPress={onAddRecipe} style={styles.cta} />
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: SCREEN_PADDING_H * 2,
    gap: spacing.sm,
    paddingBottom: 80,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.title,
    textAlign: "center",
  },
  hint: {
    ...typography.bodySmall,
    textAlign: "center",
  },
  cta: {
    marginTop: spacing.lg,
  },
});
