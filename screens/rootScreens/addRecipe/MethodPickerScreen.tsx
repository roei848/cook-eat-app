import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

import Screen from "../../Screen";
import { ThemeColors } from "../../../theme/colors";
import { useThemeColors } from "../../../theme/useThemeColors";
import { typography } from "../../../theme/typography";
import { radius, spacing, SCREEN_PADDING_H } from "../../../theme/spacing";
import ScalePressable from "../../../components/ui/ScalePressable";

interface MethodPickerScreenProps {
  onSelectManual: () => void;
  onSelectImage: () => void;
  onSelectUrl: () => void;
}

interface MethodCard {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress: () => void;
}

export default function MethodPickerScreen({
  onSelectManual,
  onSelectImage,
  onSelectUrl,
}: MethodPickerScreenProps) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const methods: MethodCard[] = [
    {
      icon: "create-outline",
      title: "ידני",
      subtitle: "הזן את המתכון שלב אחר שלב",
      onPress: onSelectManual,
    },
    {
      icon: "camera-outline",
      title: "תמונה",
      subtitle: "סרוק מתכון כתוב יד עם AI",
      onPress: onSelectImage,
    },
    {
      icon: "link-outline",
      title: "קישור",
      subtitle: "הדבק URL של מתכון מהאינטרנט",
      onPress: onSelectUrl,
    },
  ];

  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.title}>הוספת מתכון</Text>
        <Text style={styles.subtitle}>בחר את שיטת ההוספה</Text>

        <View style={styles.cards}>
          {methods.map((method, index) => (
            <Animated.View
              key={method.title}
              entering={FadeInUp.delay(200 + index * 100)}
            >
              <ScalePressable
                onPress={method.onPress}
                style={styles.card}
                accessibilityRole="button"
              >
                <View style={styles.iconContainer}>
                  <Ionicons name={method.icon} size={28} color={colors.primary[500]} />
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{method.title}</Text>
                  <Text style={styles.cardSubtitle}>{method.subtitle}</Text>
                </View>
                {/* chevron-back = forward disclosure under forced RTL */}
                <Ionicons name="chevron-back" size={20} color={colors.text.muted} />
              </ScalePressable>
            </Animated.View>
          ))}
        </View>
      </View>
    </Screen>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: SCREEN_PADDING_H,
      paddingTop: spacing.lg,
    },
    title: {
      ...typography.displayL,
      color: colors.text.primary,
    },
    subtitle: {
      ...typography.body,
      color: colors.text.secondary,
      marginTop: spacing.xs,
      marginBottom: spacing.xxxl,
    },
    cards: {
      gap: spacing.lg,
    },
    card: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.lg,
      backgroundColor: colors.card.default,
      borderRadius: radius.md,
      padding: spacing.xl,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.07,
      shadowRadius: 8,
      elevation: 4,
    },
    iconContainer: {
      width: 56,
      height: 56,
      borderRadius: radius.sm,
      backgroundColor: colors.primary[100],
      justifyContent: "center",
      alignItems: "center",
    },
    cardContent: {
      flex: 1,
    },
    cardTitle: {
      ...typography.titleL,
      color: colors.text.primary,
    },
    cardSubtitle: {
      ...typography.bodySmall,
      color: colors.text.secondary,
      marginTop: 2,
    },
  });
