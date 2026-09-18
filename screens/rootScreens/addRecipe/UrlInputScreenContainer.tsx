import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { AddRecipeStackParamList } from "./AddRecipeStack";
import { parseRecipeFromUrl } from "../../../services/gemini/geminiService";
import UrlInputScreen from "./UrlInputScreen";

type Nav = NativeStackNavigationProp<AddRecipeStackParamList>;

const URL_REGEX = /^https?:\/\/.+\..+/i;

export default function UrlInputScreenContainer() {
  const navigation = useNavigation<Nav>();

  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  async function handleAnalyze() {
    const recipeLink = url.trim();
    if (!URL_REGEX.test(recipeLink)) {
      setErrorMessage("כתובת URL לא תקינה — יש להתחיל עם http:// או https://");
      return;
    }

    setIsLoading(true);
    setErrorMessage(undefined);

    try {
      // imageUrl / byWho arrive inside the partial when the page provides them
      const partialRecipe = await parseRecipeFromUrl(recipeLink);
      navigation.navigate("RecipeReview", { partialRecipe, recipeLink });
    } catch (error) {
      setErrorMessage("לא הצלחנו לגשת לכתובת, נסה שוב");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <UrlInputScreen
      url={url}
      isLoading={isLoading}
      errorMessage={errorMessage}
      onUrlChange={(text) => {
        setUrl(text);
        setErrorMessage(undefined);
      }}
      onAnalyze={handleAnalyze}
      onBack={() => navigation.goBack()}
    />
  );
}
