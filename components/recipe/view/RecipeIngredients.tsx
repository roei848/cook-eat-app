import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useSelector } from "react-redux";
import Animated, { FadeInUp } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { Ingredient } from "../../../types/recipe";
import { RootState } from "../../../store/store";
import { useThemeColors } from "../../../theme/useThemeColors";
import { ThemeColors } from "../../../theme/colors";
import AddToGrocerySheet from "../../grocery/AddToGrocerySheet";
import { fonts, typography } from "../../../theme/typography";
import { radius } from "../../../theme/spacing";

interface Props {
  ingredients: Ingredient[];
  recipeId?: string;
  recipeTitle?: string;
}

export default function RecipeIngredients({
  ingredients,
  recipeId,
  recipeTitle,
}: Props) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const uid = useSelector((state: RootState) => state.auth.user?.uid);

  const [sheetVisible, setSheetVisible] = useState(false);

  const groceryEnabled = Boolean(recipeId && uid);

  return (
    <Animated.View entering={FadeInUp.delay(300)} style={styles.card}>
      {/* Section header */}
      <View style={styles.header}>
        <Ionicons name="basket-outline" size={20} color={colors.primary[500]} />
        <Text style={styles.headerText}>מצרכים</Text>
        {groceryEnabled && (
          <Pressable
            onPress={() => setSheetVisible(true)}
            hitSlop={8}
            style={styles.cartButton}
          >
            <Ionicons name="cart-outline" size={22} color={colors.primary[500]} />
          </Pressable>
        )}
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

      {groceryEnabled && recipeId && (
        <AddToGrocerySheet
          visible={sheetVisible}
          onClose={() => setSheetVisible(false)}
          ingredients={ingredients}
          recipeId={recipeId}
          recipeTitle={recipeTitle}
        />
      )}
    </Animated.View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    card: {
      marginHorizontal: 16,
      marginTop: 20,
      backgroundColor: colors.card.default,
      borderRadius: radius.lg,
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
      ...typography.titleL,
      color: colors.text.primary,
    },
    cartButton: {
      marginStart: "auto",
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
      ...typography.body,
      fontFamily: fonts.bodySemiBold,
      color: colors.text.primary,
    },
    name: {
      ...typography.body,
      color: colors.text.primary,
      flex: 1,
    },
    separator: {
      height: 1,
      backgroundColor: colors.border.default,
    },
  });
