import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { Step } from "../../../types/recipe";
import { useThemeColors } from "../../../theme/useThemeColors";
import { ThemeColors } from "../../../theme/colors";

export default function RecipeSteps({ steps }: { steps: Step[] }) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const sorted = [...steps].sort((a, b) => a.order - b.order);

  return (
    <Animated.View entering={FadeInUp.delay(400)} style={styles.card}>
      {/* Section header */}
      <View style={styles.header}>
        <Ionicons name="list-outline" size={20} color={colors.primary[500]} />
        <Text style={styles.headerText}>שלבי הכנה</Text>
      </View>

      {/* Steps */}
      {sorted.map((step, idx) => {
        const isLast = idx === sorted.length - 1;
        return (
          <View key={step.order} style={styles.stepRow}>
            {/* Timeline column */}
            <View style={styles.timelineCol}>
              <View style={styles.circle}>
                <Text style={styles.circleNumber}>{step.order}</Text>
              </View>
              {!isLast && <View style={styles.connector} />}
            </View>

            {/* Step text */}
            <Text style={[styles.stepText, isLast && styles.lastStepText]}>
              {step.text}
            </Text>
          </View>
        );
      })}
    </Animated.View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    card: {
      marginHorizontal: 16,
      marginTop: 20,
      backgroundColor: colors.card.default,
      borderRadius: 20,
      padding: 20,
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
      marginBottom: 20,
    },
    headerText: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.text.primary,
    },
    stepRow: {
      flexDirection: "row",
      gap: 14,
    },
    timelineCol: {
      alignItems: "center",
      width: 36,
    },
    circle: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.primary[100],
      justifyContent: "center",
      alignItems: "center",
    },
    circleNumber: {
      fontSize: 16,
      fontWeight: "800",
      color: colors.primary[500],
    },
    connector: {
      width: 2,
      flex: 1,
      minHeight: 16,
      backgroundColor: colors.primary[100],
      marginVertical: 4,
    },
    stepText: {
      flex: 1,
      fontSize: 15,
      lineHeight: 22,
      color: colors.text.primary,
      paddingTop: 7,
      paddingBottom: 20,
    },
    lastStepText: {
      paddingBottom: 0,
    },
  });
