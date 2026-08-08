import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { Recipe } from "../../types/recipe";
import { useThemeColors } from "../../theme/useThemeColors";
import { ThemeColors } from "../../theme/colors";
import ScalePressable from "../ui/ScalePressable";
import { typography } from "../../theme/typography";
import { radius } from "../../theme/spacing";

type Props = {
  recipe: Recipe;
  onPress: () => void;
};

export default function RecipeCardHorizontal({ recipe, onPress }: Props) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  return (
    <ScalePressable onPress={onPress} scaleTo={0.95} style={styles.card}>
        <Image
          source={
            recipe.imageUrl
              ? { uri: recipe.imageUrl }
              : require("../../assets/arthur.png")
          }
          style={styles.image}
        />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.35)", "rgba(0,0,0,0.72)"]}
          locations={[0, 0.45, 1]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.overlay}
        />
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {recipe.title}
          </Text>
          <Text style={styles.time}>{recipe.timeInMinutes} דק׳</Text>
        </View>
    </ScalePressable>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    card: {
      width: 160,
      height: 200,
      borderRadius: radius.md,
      overflow: "hidden",
      marginEnd: 14,
      backgroundColor: colors.card.default,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 10,
      elevation: 5,
    },
    image: {
      width: "100%",
      height: "100%",
      position: "absolute",
    },
    overlay: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: 100,
    },
    textContainer: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      padding: 12,
    },
    title: {
      ...typography.title,
      fontSize: 14,
      lineHeight: 19,
      color: "#FFFFFF",
    },
    time: {
      ...typography.caption,
      color: "rgba(255,255,255,0.85)",
      marginTop: 2,
    },
  });
