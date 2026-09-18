import React, { useEffect, useLayoutEffect } from "react";
import { Pressable } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";

import { RootState } from "../../../store/store";
import { useThemeColors } from "../../../theme/useThemeColors";

import RecipeView from "../../../components/recipe/RecipeView";
import HeaderTextButton from "../../../components/ui/HeaderTextButton";
import { SharedRecipeParams } from "./sharedRecipeRoutes";

type Props = NativeStackScreenProps<SharedRecipeParams, "Recipe">;

export default function RecipeScreen({ navigation, route }: Props) {
  const { recipeId } = route.params;
  const colors = useThemeColors();

  // Selected from Redux (kept fresh by the Firestore onSnapshot subscription),
  // so the view re-renders with saved edits and new notes immediately.
  const recipe = useSelector((state: RootState) =>
    state.recipes.items.find((r) => r.id === recipeId)
  );

  // Recipe deleted while this screen is mounted → leave.
  // isFocused() avoids a double-pop race with EditRecipe's popToTop.
  useEffect(() => {
    if (!recipe && navigation.isFocused()) {
      navigation.goBack();
    }
  }, [recipe, navigation]);

  useLayoutEffect(() => {
    if (!recipe) return;

    navigation.setOptions({
      title: "",
      headerTransparent: true,
      headerTintColor: "#FFFFFF",
      headerShadowVisible: false,
      headerLeft: () => (
        <Pressable onPress={() => navigation.goBack()} style={{ padding: 8 }}>
          {/* chevron-forward = back under forced RTL (header is RTL, so this sits top-right) */}
          <Ionicons
            name="chevron-forward-outline"
            size={28}
            color={colors.primary[500]}
          />
        </Pressable>
      ),
      headerRight: () => (
        <HeaderTextButton
          label="עריכה"
          onPress={() => navigation.navigate("EditRecipe", { recipeId })}
        />
      ),
    });
  }, [navigation, recipe, recipeId, colors]);

  if (!recipe) return null;

  return <RecipeView recipe={recipe} />;
}
