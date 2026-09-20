import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

import { Category } from "../../../types/enums/category";
import { CATEGORY_COLORS } from "../../../theme/categoryColors";

/**
 * Shared photo treatment for hero surfaces (recipe hero, Home daily card):
 * the recipe photo — or the placeholder with a warm tint and a centered
 * category icon — under a bottom scrim that keeps on-photo text legible.
 * Fills its parent; the parent owns size, radius and clipping.
 */
export default function RecipePhotoBackdrop({
  imageUrl,
  category,
}: {
  imageUrl?: string;
  category: Category;
}) {
  const hasImage = !!imageUrl;
  const imageSource = hasImage
    ? { uri: imageUrl }
    : require("../../../assets/arthur.png");

  return (
    <View style={StyleSheet.absoluteFill}>
      <Image source={imageSource} style={styles.image} resizeMode="cover" />

      {!hasImage && <View style={styles.fallbackOverlay} />}

      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.45)", "rgba(0,0,0,0.8)"]}
        locations={[0, 0.5, 1]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.gradient}
      />

      {!hasImage && (
        <View style={styles.fallbackIcon}>
          <Ionicons
            name={CATEGORY_COLORS[category].icon as any}
            size={52}
            color="rgba(255,255,255,0.6)"
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: "100%",
  },
  fallbackOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(255, 122, 0, 0.12)",
  },
  fallbackIcon: {
    ...StyleSheet.absoluteFill,
    justifyContent: "center",
    alignItems: "center",
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "55%",
  },
});
