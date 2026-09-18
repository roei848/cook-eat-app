import React, { useMemo, useState } from "react";
import { Alert } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";

import { Recipe } from "../../../types/recipe";
import { RootState } from "../../../store/store";
import { AddRecipeStackParamList } from "./AddRecipeStack";
import { createRecipe } from "../../../services/firebase/recipeService";
import { uploadRecipeImage } from "../../../services/firebase/storageService";
import { validateRecipe } from "../../../utils/recipeValidation";
import RecipeReviewScreen from "./RecipeReviewScreen";

type Nav = NativeStackNavigationProp<AddRecipeStackParamList>;
type Route = RouteProp<AddRecipeStackParamList, "RecipeReview">;

/** Firebase Storage download URLs are already ours; any other http(s) image is a hotlink to the source site. */
function isHotlinkedImage(url: string): boolean {
  return /^https?:\/\//i.test(url) && !url.includes("firebasestorage.googleapis.com");
}

// Saving must not hang on a slow source site — past this, keep the hotlink
const REHOST_TIMEOUT_MS = 15_000;

/**
 * Copy a source site's photo into our Storage so the recipe keeps its picture
 * if the site moves it or blocks hotlinking. On failure or timeout the
 * hotlink is still better than no image, so that is what comes back.
 */
async function rehostImage(hotlink: string): Promise<string> {
  const keepHotlink = new Promise<string>((resolve) =>
    setTimeout(() => resolve(hotlink), REHOST_TIMEOUT_MS)
  );
  return Promise.race([uploadRecipeImage(hotlink), keepHotlink]).catch(() => hotlink);
}

export default function RecipeReviewScreenContainer() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { partialRecipe, handwrittenRecipeImg, recipeLink } = route.params;

  const userName = useSelector(
    (state: RootState) => state.user.profile?.name ?? ""
  );

  const [recipe, setRecipe] = useState<Partial<Recipe>>(() => ({
    ...partialRecipe,
    // Credit the page's author when the source names one, else the person saving
    byWho: partialRecipe.byWho?.trim() || userName,
    // Pre-fill the link field so the URL flow shows where the recipe came from
    recipeLink: partialRecipe.recipeLink ?? recipeLink,
  }));
  const [photoUri, setPhotoUri] = useState<string | undefined>();
  const [isSaving, setIsSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Danger highlighting only after a failed save attempt, live until fixed
  const errors = useMemo(
    () => (submitted ? validateRecipe(recipe).errors : undefined),
    [submitted, recipe]
  );

  function handleUpdateRecipe(updates: Partial<Recipe>) {
    setRecipe((prev) => ({ ...prev, ...updates }));
  }

  async function handleSave() {
    const { valid, errors: validationErrors } = validateRecipe(recipe);
    if (!valid) {
      setSubmitted(true);
      Alert.alert("שדות חסרים", Object.values(validationErrors).join("\n"));
      return;
    }

    setIsSaving(true);
    try {
      let imageUrl = recipe.imageUrl;
      if (photoUri) {
        imageUrl = await uploadRecipeImage(photoUri);
      } else if (imageUrl && isHotlinkedImage(imageUrl)) {
        imageUrl = await rehostImage(imageUrl);
      }

      const id = await createRecipe({
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
        recipeLink: recipe.recipeLink?.trim() || undefined,
        handwrittenRecipeImg,
      });
      if (!id) throw new Error("createRecipe returned null");

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
      errors={errors}
      onUpdateRecipe={handleUpdateRecipe}
      onPhotoSelected={setPhotoUri}
      onSave={handleSave}
    />
  );
}
