import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { ThemeColors } from "../../../theme/colors";
import { useThemeColors } from "../../../theme/useThemeColors";

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
        <TouchableOpacity style={styles.backButton} onPress={onBack} hitSlop={8}>
          <Ionicons name="chevron-back" size={20} color={colors.primary[500]} />
        </TouchableOpacity>
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
      paddingHorizontal: 16,
      marginBottom: 20,
      gap: 10,
    },
    backButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: `${colors.primary[500]}1A`,
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
