import React from "react";
import { View, Image, Text, StyleSheet, Dimensions } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Recipe } from "../../../types/recipe";
import { CATEGORY_COLORS } from "../../../theme/categoryColors";
import { typography } from "../../../theme/typography";
import RecipeCategoryBadge from "./RecipeCategoryBadge";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");
const HERO_HEIGHT = SCREEN_HEIGHT * 0.45;

export default function RecipeHeroImage({
  recipe,
  insetTop,
}: {
  recipe: Recipe;
  insetTop: number;
}) {
  const imageSource = recipe.imageUrl
    ? { uri: recipe.imageUrl }
    : require("../../../assets/arthur.png");

  const hasImage = !!recipe.imageUrl;
  const categoryEntry = CATEGORY_COLORS[recipe.category];

  return (
    <Animated.View entering={FadeIn.duration(400)} style={styles.container}>
      <Image source={imageSource} style={styles.image} resizeMode="cover" />

      {/* Warm tint overlay for fallback image */}
      {!hasImage && <View style={styles.fallbackOverlay} />}

      {/* Gradient overlay at bottom */}
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.45)", "rgba(0,0,0,0.8)"]}
        locations={[0, 0.5, 1]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.gradient}
      />

      {/* Title on gradient */}
      <Text style={styles.title}>{recipe.title}</Text>

      {/* Category badge — top trailing, below header */}
      <View style={[styles.badgeContainer, { top: insetTop + 54 }]}>
        <RecipeCategoryBadge category={recipe.category} />
      </View>

      {/* Centered icon for fallback */}
      {!hasImage && (
        <View style={styles.fallbackIcon}>
          <Ionicons
            name={categoryEntry.icon as any}
            size={52}
            color="rgba(255,255,255,0.6)"
          />
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: HERO_HEIGHT,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  fallbackOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 122, 0, 0.12)",
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "55%",
  },
  title: {
    position: "absolute",
    bottom: 32,
    start: 20,
    end: 20,
    ...typography.displayL,
    color: "#FFFFFF",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  badgeContainer: {
    position: "absolute",
    start: 16,
  },
  fallbackIcon: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
});
