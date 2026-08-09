import React from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { ThemeColors } from "../../../theme/colors";
import { useThemeColors } from "../../../theme/useThemeColors";
import { withAlpha } from "../../../theme/categoryColors";
import { radius, spacing, SCREEN_PADDING_H } from "../../../theme/spacing";
import ScalePressable from "../../ui/ScalePressable";

interface WizardProgressBarProps {
  currentStep: number;
  totalSteps?: number;
  onBack?: () => void;
}

export default function WizardProgressBar({
  currentStep,
  totalSteps = 3,
  onBack,
}: WizardProgressBarProps) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      {onBack && (
        <ScalePressable
          onPress={onBack}
          hitSlop={8}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="חזרה"
        >
          {/* chevron-forward = back under forced RTL */}
          <Ionicons name="chevron-forward" size={20} color={colors.primary[500]} />
        </ScalePressable>
      )}
      <View style={styles.segments}>
        {Array.from({ length: totalSteps }, (_, i) => (
          <View
            key={i}
            style={[styles.segment, i < currentStep ? styles.active : styles.inactive]}
          />
        ))}
      </View>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: SCREEN_PADDING_H,
      marginBottom: spacing.lg,
      gap: spacing.md,
    },
    backButton: {
      width: 36,
      height: 36,
      borderRadius: radius.pill,
      backgroundColor: withAlpha(colors.primary[500], 0.1),
      alignItems: "center",
      justifyContent: "center",
    },
    segments: {
      flex: 1,
      flexDirection: "row",
      gap: 6,
    },
    segment: {
      flex: 1,
      height: 4,
      borderRadius: 2,
    },
    active: {
      backgroundColor: colors.primary[500],
    },
    inactive: {
      backgroundColor: colors.border.default,
    },
  });
