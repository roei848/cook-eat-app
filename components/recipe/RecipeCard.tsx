import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

import { Recipe } from "../../types/recipe";
import { useThemeColors } from "../../theme/useThemeColors";
import { ThemeColors } from "../../theme/colors";
import CookingTimeBox from "./CookingTimeBox";
import DifficultyBox from "./DifficultyBox";

type Props = {
  recipe: Recipe;
  onPress: () => void;
};

export default function RecipeCard({ recipe, onPress }: Props) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={styles.card}
    >
      {/* Image */}
      <Image
        source={
          recipe.imageUrl
            ? { uri: recipe.imageUrl }
            : require("../../assets/arthur.png")
        }
        style={styles.image}
      />

      {/* Content */}
      <View style={styles.content}>
        <Text
          style={[styles.title, { color: colors.text.primary }]}
          numberOfLines={2}
        >
          {recipe.title}
        </Text>

        <Text
          style={[styles.description, { color: colors.text.secondary }]}
          numberOfLines={2}
        >
          {recipe.description}
        </Text>

        {/* Meta */}
        <View style={styles.metaRow}>
          <CookingTimeBox minutes={recipe.timeInMinutes} />
          <DifficultyBox difficulty={recipe.difficulty} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    card: {
      flexDirection: "row",
      backgroundColor: colors.card.default,
      borderRadius: 4,
      padding: 12,
      marginBottom: 12,
      width: "90%",
    },
    image: {
      width: 90,
      height: 90,
      borderRadius: 10,
      backgroundColor: colors.background.secondary,
    },
    content: {
      flex: 1,
      marginLeft: 12,
      justifyContent: "space-between",
    },
    title: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text.primary,
    },
    description: {
      fontSize: 13,
      marginTop: 4,
      color: colors.text.secondary,
    },
    metaRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 8,
      gap: 12,
    },
  });
