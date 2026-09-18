import React from "react";
import { View, StyleSheet } from "react-native";

import { ThemeColors } from "../../../theme/colors";
import { useThemeColors } from "../../../theme/useThemeColors";
import { spacing, SCREEN_PADDING_H } from "../../../theme/spacing";
import BackButton from "../../ui/BackButton";

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
      {onBack && <BackButton onPress={onBack} />}
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
