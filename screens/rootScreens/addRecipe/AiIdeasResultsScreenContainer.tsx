import React, { useEffect, useMemo, useRef, useState } from "react";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { AddRecipeStackParamList } from "./AddRecipeStack";
import { AiRecipeOption } from "../../../types/aiIdeas";
import { generateRecipeIdeas } from "../../../services/gemini/recipeIdeasService";
import AiIdeasResultsScreen, { ResultsState } from "./AiIdeasResultsScreen";

type Nav = NativeStackNavigationProp<AddRecipeStackParamList>;
type Route = RouteProp<AddRecipeStackParamList, "AiIdeasResults">;

// Enough for "הצעות אחרות" to stay fresh without the prompt growing forever
const MAX_REMEMBERED_TITLES = 12;

function errorMessageFor(error: unknown): string {
  const text = error instanceof Error ? error.message : String(error);
  if (text.includes("GEMINI_API_KEY")) return "שירות ה-AI לא מוגדר במכשיר הזה";
  return "לא הצלחנו להביא רעיונות כרגע";
}

export default function AiIdeasResultsScreenContainer() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  // Only absent if popTo had to push this route instead of returning to it
  const request = route.params?.request;
  const savedOptionId = route.params?.savedOptionId;

  const [state, setState] = useState<ResultsState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const previousTitlesRef = useRef<string[]>([]);

  // Keyed on content, not reference: a param merge after a save must not refetch
  const requestKey = useMemo(() => JSON.stringify(request ?? null), [request]);

  useEffect(() => {
    if (!request) {
      setState({ status: "error", message: "הבקשה לא נמצאה — נסה שוב מהמסך הקודם" });
      return;
    }

    const controller = new AbortController();
    setState({ status: "loading" });

    generateRecipeIdeas(request, {
      signal: controller.signal,
      avoidTitles: previousTitlesRef.current,
    })
      .then((options) => {
        if (controller.signal.aborted) return;
        const titles = options
          .map((option) => option.recipe.title)
          .filter((title): title is string => Boolean(title));
        previousTitlesRef.current = [...previousTitlesRef.current, ...titles].slice(
          -MAX_REMEMBERED_TITLES
        );
        setState({ status: "ready", options });
      })
      .catch((error) => {
        // Back / unmount mid-request: nothing to show, nothing to log
        if (controller.signal.aborted) return;
        console.error("[AiIdeasResults] generation failed:", error);
        setState({ status: "error", message: errorMessageFor(error) });
      });

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestKey, attempt]);

  // With merge:true a second save overwrites the param, so accumulate here
  useEffect(() => {
    if (!savedOptionId) return;
    setSavedIds((prev) =>
      prev.includes(savedOptionId) ? prev : [...prev, savedOptionId]
    );
  }, [savedOptionId]);

  function handleSelect(option: AiRecipeOption) {
    // isFocused is the existing double-navigation guard: a double-tap would
    // otherwise push RecipeReview twice
    if (!request || savedIds.includes(option.id) || !navigation.isFocused()) return;
    navigation.navigate("RecipeReview", {
      partialRecipe: option.recipe,
      aiOrigin: { optionId: option.id, request },
    });
  }

  function handleRegenerate() {
    if (state.status === "loading") return;
    setAttempt((count) => count + 1);
  }

  return (
    <AiIdeasResultsScreen
      request={request}
      state={state}
      savedIds={savedIds}
      onSelect={handleSelect}
      onRegenerate={handleRegenerate}
      onEditRequest={() => navigation.goBack()}
      onDone={() => navigation.popToTop()}
      onBack={() => navigation.goBack()}
    />
  );
}
