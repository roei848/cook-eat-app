import React, { useState } from "react";
import { Alert } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";

import { Recipe } from "../../../types/recipe";
import { RootState } from "../../../store/store";
import { AddRecipeStackParamList } from "./AddRecipeStack";
import { createRecipe } from "../../../services/firebase/recipeService";
import { uploadRecipeImage } from "../../../services/firebase/storageService";
import RecipeReviewScreen from "./RecipeReviewScreen";

type Nav = NativeStackNavigationProp<AddRecipeStackParamList>;
type Route = RouteProp<AddRecipeStackParamList, "RecipeReview">;

export default function RecipeReviewScreenContainer() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { partialRecipe, handwrittenRecipeImg, recipeLink } = route.params;

  const userName = useSelector(
    (state: RootState) => state.user.profile?.name ?? ""
  );

  const [recipe, setRecipe] = useState<Partial<Recipe>>({
    byWho: userName,
    ...partialRecipe,
  });
  const [photoUri, setPhotoUri] = useState<string | undefined>();
  const [isSaving, setIsSaving] = useState(false);

  function handleUpdateRecipe(updates: Partial<Recipe>) {
    setRecipe((prev) => ({ ...prev, ...updates }));
  }

  async function handleSave() {
    if (
      !recipe.title?.trim() ||
      !recipe.category ||
      !recipe.difficulty ||
      !recipe.timeInMinutes ||
      !recipe.byWho?.trim() ||
      !recipe.ingredients?.length ||
      !recipe.steps?.length
    ) {
      Alert.alert(
        "שדות חסרים",
        "יש למלא: שם, קטגוריה, קושי, זמן הכנה, מאת, לפחות רכיב אחד ושלב אחד"
      );
      return;
    }

    setIsSaving(true);
    try {
      let imageUrl = recipe.imageUrl;
      if (photoUri) {
        imageUrl = await uploadRecipeImage(photoUri);
      }

      await createRecipe({
        title: recipe.title!,
        description: recipe.description ?? "",
        category: recipe.category!,
        difficulty: recipe.difficulty!,
        timeInMinutes: recipe.timeInMinutes!,
        byWho: recipe.byWho!,
        relatives: recipe.relatives ?? [],
        ingredients: recipe.ingredients!,
        steps: recipe.steps!,
        imageUrl,
        recipeLink,
        handwrittenRecipeImg,
      });

      navigation.reset({ index: 0, routes: [{ name: "MethodPicker" }] });
    } catch (error) {
      Alert.alert("שמירה נכשלה", "נסה שוב");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <RecipeReviewScreen
      recipe={recipe}
      isSaving={isSaving}
      photoUri={photoUri}
      onUpdateRecipe={handleUpdateRecipe}
      onPhotoSelected={setPhotoUri}
      onSave={handleSave}
    />
  );
}
