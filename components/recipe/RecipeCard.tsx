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
import CookingTimeBox from "./CookingTimeBox";
import DifficultyBox from "./DifficultyBox";

type Props = {
  recipe: Recipe;
  onPress: () => void;
};

export default function RecipeCard({ recipe, onPress }: Props) {
  const colors = useThemeColors();
  const styles = createStyles(colors);
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPressIn={() => {
        scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 15, stiffness: 300 });
      }}
      onPress={onPress}
    >
      <Animated.View style={[styles.card, animStyle]}>
        {/* Accent bar */}
        <View style={styles.accentBar} />

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
          <Text style={styles.title} numberOfLines={2}>
            {recipe.title}
          </Text>

          <Text style={styles.description} numberOfLines={2}>
            {recipe.description}
          </Text>

          {/* Meta */}
          <View style={styles.metaRow}>
            <CookingTimeBox minutes={recipe.timeInMinutes} />
            <DifficultyBox difficulty={recipe.difficulty} />
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    card: {
      flexDirection: "row",
      backgroundColor: colors.card.default,
      borderRadius: 20,
      padding: 12,
      marginBottom: 14,
      width: "95%",
      alignSelf: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.09,
      shadowRadius: 8,
      elevation: 4,
      overflow: "hidden",
    },
    accentBar: {
      position: "absolute",
      right: 0,
      top: 0,
      bottom: 0,
      width: 4,
      backgroundColor: colors.primary[300],
      borderTopRightRadius: 20,
      borderBottomRightRadius: 20,
    },
    image: {
      width: 110,
      height: 110,
      borderRadius: 16,
      backgroundColor: colors.background.secondary,
      marginStart: 4,
    },
    content: {
      flex: 1,
      marginHorizontal: 12,
      justifyContent: "space-between",
    },
    title: {
      fontSize: 17,
      fontWeight: "700",
      color: colors.text.primary,
      lineHeight: 22,
    },
    description: {
      fontSize: 13,
      marginTop: 4,
      color: colors.text.secondary,
      lineHeight: 18,
    },
    metaRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 8,
      gap: 8,
    },
  });
