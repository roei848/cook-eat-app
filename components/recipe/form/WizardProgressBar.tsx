import React from "react";
import { View, StyleSheet } from "react-native";

import { ThemeColors } from "../../../theme/colors";
import { useThemeColors } from "../../../theme/useThemeColors";

interface WizardProgressBarProps {
  currentStep: number;
  totalSteps?: number;
}

export default function WizardProgressBar({
  currentStep,
  totalSteps = 3,
}: WizardProgressBarProps) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }, (_, i) => (
        <View
          key={i}
          style={[styles.segment, i < currentStep ? styles.active : styles.inactive]}
        />
      ))}
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      gap: 6,
      paddingHorizontal: 16,
      marginBottom: 20,
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
