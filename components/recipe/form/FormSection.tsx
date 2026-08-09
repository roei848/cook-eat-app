import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { ThemeColors } from "../../../theme/colors";
import { useThemeColors } from "../../../theme/useThemeColors";
import { typography } from "../../../theme/typography";
import { radius, spacing } from "../../../theme/spacing";

interface FormSectionProps {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  title: string;
  optionalHint?: string;
  children: React.ReactNode;
}

/**
 * Section card for form screens — same surface as the recipe view cards
 * (RecipeIngredients / RecipeSteps): card background, radius.lg, soft shadow,
 * icon + titleL header.
 */
export default function FormSection({
  icon,
  title,
  optionalHint,
  children,
}: FormSectionProps) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Ionicons name={icon} size={20} color={colors.primary[500]} />
        <Text style={styles.headerText}>{title}</Text>
        {optionalHint && <Text style={styles.optionalHint}>{optionalHint}</Text>}
      </View>
      {children}
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.card.default,
      borderRadius: radius.lg,
      padding: spacing.xl,
      marginBottom: spacing.xl,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.07,
      shadowRadius: 8,
      elevation: 4,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: spacing.lg,
    },
    headerText: {
      ...typography.titleL,
      color: colors.text.primary,
    },
    optionalHint: {
      ...typography.caption,
      color: colors.text.muted,
      marginStart: "auto",
    },
  });
