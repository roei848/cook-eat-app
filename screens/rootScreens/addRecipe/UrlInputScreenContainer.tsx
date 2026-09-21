import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { AddRecipeStackParamList } from "./AddRecipeStack";
import { parseRecipeFromUrl } from "../../../services/gemini/geminiService";
import { isHttpUrl } from "../../../utils/url";
import UrlInputScreen from "./UrlInputScreen";

type Nav = NativeStackNavigationProp<AddRecipeStackParamList>;

export default function UrlInputScreenContainer() {
  const navigation = useNavigation<Nav>();

  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  async function handleAnalyze() {
    const recipeLink = url.trim();
    if (!isHttpUrl(recipeLink)) {
      setErrorMessage("כתובת URL לא תקינה — יש להתחיל עם http:// או https://");
      return;
    }

    setIsLoading(true);
    setErrorMessage(undefined);

    try {
      // imageUrl / byWho arrive inside the partial when the page provides them
      const partialRecipe = await parseRecipeFromUrl(recipeLink);
      // Hardware back / swipe-back are not disabled while loading — don't push
      // the review over whatever the user navigated to meanwhile.
      if (navigation.isFocused()) {
        navigation.navigate("RecipeReview", { partialRecipe, recipeLink });
      }
    } catch (error) {
      setErrorMessage("לא הצלחנו לגשת לכתובת, נסה שוב");
    } finally {
      setIsLoading(false);
    }
  }

  // `replace`, not `navigate`: once the user gives up on the link, Back should
  // land on MethodPicker rather than on a dead URL screen. Text that is not
  // URL-shaped was probably the caption itself, so carry it over.
  function handlePasteTextInstead() {
    const typed = url.trim();
    const initialText = isHttpUrl(typed) ? undefined : typed;
    navigation.replace("FreeTextInput", initialText ? { initialText } : undefined);
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
      onPasteTextInstead={handlePasteTextInstead}
      onBack={() => navigation.goBack()}
    />
  );
}
