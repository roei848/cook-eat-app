import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

import { ThemeColors } from "../../theme/colors";
import { useThemeColors } from "../../theme/useThemeColors";
import { withAlpha } from "../../theme/categoryColors";
import { typography } from "../../theme/typography";
import { radius, spacing, SCREEN_PADDING_H } from "../../theme/spacing";
import ScalePressable from "../ui/ScalePressable";

type Props = {
  onPress: () => void;
};

/** Home entry point into the AI recipe ideas flow. */
export default function AiIdeasPromoCard({ onPress }: Props) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  return (
    <View style={styles.wrapper}>
      <ScalePressable
        onPress={onPress}
        scaleTo={0.97}
        style={styles.card}
        accessibilityRole="button"
        accessibilityLabel="רעיונות למתכונים מ-AI"
      >
        {/* Brand tint over the card surface so it reads in both themes */}
        <LinearGradient
          colors={[withAlpha(colors.primary[500], 0.22), withAlpha(colors.primary[500], 0.05)]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <View style={styles.iconCircle}>
            <Ionicons name="sparkles" size={24} color={colors.text.inverse} />
          </View>
          <View style={styles.textBlock}>
            <Text style={styles.title}>אין רעיון מה לבשל?</Text>
            <Text style={styles.subtitle}>ספרו מה יש במקרר ונציע 3 מתכונים</Text>
          </View>
          {/* chevron-back = forward under forced RTL */}
          <Ionicons name="chevron-back" size={20} color={colors.primary[700]} />
        </LinearGradient>
      </ScalePressable>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    wrapper: {
      paddingHorizontal: SCREEN_PADDING_H,
    },
    card: {
      borderRadius: radius.lg,
      backgroundColor: colors.card.default,
      overflow: "hidden",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.08,
      shadowRadius: 10,
      elevation: 4,
    },
    gradient: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.lg,
      padding: spacing.xl,
    },
    iconCircle: {
      width: 48,
      height: 48,
      borderRadius: radius.pill,
      backgroundColor: colors.primary[500],
      justifyContent: "center",
      alignItems: "center",
    },
    textBlock: {
      flex: 1,
    },
    title: {
      ...typography.displayM,
      color: colors.text.primary,
    },
    subtitle: {
      ...typography.bodySmall,
      color: colors.text.secondary,
      marginTop: 2,
    },
  });
