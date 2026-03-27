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
    if (!URL_REGEX.test(url.trim())) {
      setErrorMessage("כתובת URL לא תקינה — יש להתחיל עם http:// או https://");
      return;
    }

    setIsLoading(true);
    setErrorMessage(undefined);

    try {
      const result = await parseRecipeFromUrl(url.trim());
      const { imageUrl, ...partialRecipe } = result;

      navigation.navigate("RecipeReview", {
        partialRecipe: imageUrl ? { ...partialRecipe, imageUrl } : partialRecipe,
        recipeLink: url.trim(),
      });
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
