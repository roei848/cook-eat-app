import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { Recipe } from "../../../types/recipe";
import { useThemeColors } from "../../../theme/useThemeColors";
import { ThemeColors } from "../../../theme/colors";
import CookingTimeBox from "../CookingTimeBox";
import DifficultyBox from "../DifficultyBox";
import RecipeRelativesTags from "./RecipeRelativesTags";

export default function RecipeInfoCard({ recipe }: { recipe: Recipe }) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  return (
    <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.card}>
      {/* Meta row: time + difficulty + byWho */}
      <View style={styles.metaRow}>
        <CookingTimeBox minutes={recipe.timeInMinutes} />
        <DifficultyBox difficulty={recipe.difficulty} />
        <View style={styles.byWhoPill}>
          <Ionicons name="person-outline" size={13} color={colors.text.muted} />
          <Text style={styles.byWhoText}>{recipe.byWho}</Text>
        </View>
      </View>

      {/* Description */}
      {!!recipe.description && (
        <Text style={styles.description}>{recipe.description}</Text>
      )}

      {/* Dietary tags */}
      <RecipeRelativesTags relatives={recipe.relatives} />
    </Animated.View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    card: {
      marginTop: -30,
      marginHorizontal: 16,
      backgroundColor: colors.card.default,
      borderRadius: 24,
      padding: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 6,
    },
    metaRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      alignItems: "center",
    },
    byWhoPill: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      backgroundColor: colors.background.secondary,
      borderRadius: 10,
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    byWhoText: {
      fontSize: 12,
      fontWeight: "600",
      color: colors.text.muted,
    },
    description: {
      marginTop: 14,
      fontSize: 15,
      lineHeight: 22,
      color: colors.text.secondary,
    },
  });
