import React from "react";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { Recipe } from "../../types/recipe";
import { useThemeColors } from "../../theme/useThemeColors";
import { ThemeColors } from "../../theme/colors";

type Props = {
  recipe: Recipe;
  onPress: () => void;
};

export default function RecipeCardHorizontal({ recipe, onPress }: Props) {
  const colors = useThemeColors();
  const styles = createStyles(colors);
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPressIn={() => {
        scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 15, stiffness: 300 });
      }}
      onPress={onPress}
    >
      <Animated.View style={[styles.card, animStyle]}>
        <Image
          source={
            recipe.imageUrl
              ? { uri: recipe.imageUrl }
              : require("../../assets/arthur.png")
          }
          style={styles.image}
        />
        {/* Gradient-like overlay at bottom */}
        <View style={styles.overlay} />
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {recipe.title}
          </Text>
          <Text style={styles.time}>{recipe.timeInMinutes} דק׳</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    card: {
      width: 160,
      height: 200,
      borderRadius: 20,
      overflow: "hidden",
      marginLeft: 14,
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
      height: 90,
      backgroundColor: "rgba(0,0,0,0.52)",
    },
    textContainer: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      padding: 12,
    },
    title: {
      fontSize: 14,
      fontWeight: "700",
      color: "#FFFFFF",
      lineHeight: 18,
    },
    time: {
      fontSize: 12,
      color: "rgba(255,255,255,0.8)",
      marginTop: 4,
    },
  });
