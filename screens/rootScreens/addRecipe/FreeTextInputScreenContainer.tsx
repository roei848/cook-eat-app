import React, { useState } from "react";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { AddRecipeStackParamList } from "./AddRecipeStack";
import {
  MAX_TEXT_CHARS,
  parseRecipeFromText,
} from "../../../services/gemini/geminiService";
import { isHttpUrl } from "../../../utils/url";
import FreeTextInputScreen from "./FreeTextInputScreen";

type Nav = NativeStackNavigationProp<AddRecipeStackParamList>;
type Route = RouteProp<AddRecipeStackParamList, "FreeTextInput">;

// Anything shorter cannot hold a title plus one ingredient — reject before
// spending a model call on it.
const MIN_TEXT_CHARS = 20;

export default function FreeTextInputScreenContainer() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();

  const [text, setText] = useState(route.params?.initialText ?? "");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  async function handleAnalyze() {
    const recipeText = text.trim();

    // A bare link belongs in the URL flow: without the urlContext tool the
    // model cannot fetch it and would invent a recipe.
    if (!/\s/.test(recipeText) && isHttpUrl(recipeText)) {
      setErrorMessage("זה נראה כמו קישור — נסה את אפשרות 'קישור' במסך ההוספה");
      return;
    }
    if (recipeText.length < MIN_TEXT_CHARS) {
      setErrorMessage("הטקסט קצר מדי — הדבק את תיאור המתכון המלא");
      return;
    }

    setIsLoading(true);
    setErrorMessage(undefined);

    try {
      const partialRecipe = await parseRecipeFromText(recipeText);
      // Hardware back / swipe-back are not disabled while loading — don't push
      // the review over whatever the user navigated to meanwhile.
      if (navigation.isFocused()) {
        navigation.navigate("RecipeReview", { partialRecipe });
      }
    } catch (error) {
      console.error("[FreeTextInput] recipe extraction failed:", error);
      setErrorMessage("לא הצלחנו לזהות מתכון בטקסט, נסה שוב");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <FreeTextInputScreen
      text={text}
      maxLength={MAX_TEXT_CHARS}
      isLoading={isLoading}
      errorMessage={errorMessage}
      onTextChange={(value) => {
        setText(value);
        setErrorMessage(undefined);
      }}
      onAnalyze={handleAnalyze}
      onBack={() => navigation.goBack()}
    />
  );
}
