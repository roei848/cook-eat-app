import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Screen from "../../Screen";
import { ThemeColors } from "../../../theme/colors";
import { useThemeColors } from "../../../theme/useThemeColors";

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
        <Text style={styles.title}>הוסף מתכון</Text>
        <Text style={styles.subtitle}>בחר את שיטת ההוספה</Text>

        <View style={styles.cards}>
          {methods.map((method) => (
            <TouchableOpacity
              key={method.title}
              style={styles.card}
              onPress={method.onPress}
              activeOpacity={0.8}
            >
              <View style={styles.iconContainer}>
                <Ionicons name={method.icon} size={32} color={colors.primary[500]} />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{method.title}</Text>
                <Text style={styles.cardSubtitle}>{method.subtitle}</Text>
              </View>
              <Ionicons name="chevron-back" size={20} color={colors.text.muted} />
            </TouchableOpacity>
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
      paddingHorizontal: 20,
      paddingTop: 40,
    },
    title: {
      fontSize: 28,
      fontWeight: "800",
      color: colors.text.primary,
    },
    subtitle: {
      fontSize: 15,
      color: colors.text.secondary,
      marginTop: 4,
      marginBottom: 32,
    },
    cards: {
      gap: 16,
    },
    card: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card.default,
      borderRadius: 20,
      padding: 18,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.07,
      shadowRadius: 8,
      elevation: 3,
    },
    iconContainer: {
      width: 56,
      height: 56,
      borderRadius: 16,
      backgroundColor: colors.primary[100],
      justifyContent: "center",
      alignItems: "center",
      marginStart: 12,
    },
    cardContent: {
      flex: 1,
      marginHorizontal: 14,
    },
    cardTitle: {
      fontSize: 17,
      fontWeight: "700",
      color: colors.text.primary,
    },
    cardSubtitle: {
      fontSize: 13,
      color: colors.text.secondary,
      marginTop: 2,
    },
  });
