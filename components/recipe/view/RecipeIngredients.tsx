import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { Ingredient } from "../../../types/recipe";
import { useThemeColors } from "../../../theme/useThemeColors";
import { ThemeColors } from "../../../theme/colors";

export default function RecipeIngredients({ ingredients }: { ingredients: Ingredient[] }) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  return (
    <Animated.View entering={FadeInUp.delay(300)} style={styles.card}>
      {/* Section header */}
      <View style={styles.header}>
        <Ionicons name="basket-outline" size={20} color={colors.primary[500]} />
        <Text style={styles.headerText}>מצרכים</Text>
      </View>

      {/* Ingredient rows */}
      {ingredients.map((ingredient, idx) => (
        <View key={idx}>
          <View style={styles.row}>
            <View style={styles.dot} />
            <Text style={styles.amount}>{ingredient.amount} </Text>
            <Text style={styles.name}>{ingredient.name}</Text>
          </View>
          {idx < ingredients.length - 1 && <View style={styles.separator} />}
        </View>
      ))}
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
      marginBottom: 16,
    },
    headerText: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.text.primary,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 10,
      gap: 10,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.primary[300],
    },
    amount: {
      fontSize: 15,
      fontWeight: "600",
      color: colors.text.primary,
    },
    name: {
      fontSize: 15,
      color: colors.text.primary,
      flex: 1,
    },
    separator: {
      height: 1,
      backgroundColor: colors.border.default,
    },
  });
