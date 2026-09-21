import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Ingredient, Recipe } from "../../../types/recipe";
import { Category } from "../../../types/enums/category";
import { Difficulty } from "../../../types/enums/diffucalty";
import { Relative } from "../../../types/enums/relatives";
import { AiRecipeRequest } from "../../../types/aiIdeas";
import { useThemeColors } from "../../../theme/useThemeColors";

import MethodPickerScreenContainer from "./MethodPickerScreenContainer";
import ManualWizardStep1ScreenContainer from "./ManualWizardStep1ScreenContainer";
import ManualWizardStep2ScreenContainer from "./ManualWizardStep2ScreenContainer";
import ManualWizardStep3ScreenContainer from "./ManualWizardStep3ScreenContainer";
import ImageCaptureScreenContainer from "./ImageCaptureScreenContainer";
import UrlInputScreenContainer from "./UrlInputScreenContainer";
import FreeTextInputScreenContainer from "./FreeTextInputScreenContainer";
import AiIdeasInputScreenContainer from "./AiIdeasInputScreenContainer";
import AiIdeasResultsScreenContainer from "./AiIdeasResultsScreenContainer";
import RecipeReviewScreenContainer from "./RecipeReviewScreenContainer";

export interface ManualStep1Data {
  title: string;
  description: string;
  category: Category;
  difficulty: Difficulty;
  timeInMinutes: number;
  byWho: string;
  relatives: Relative[];
}

export type AddRecipeStackParamList = {
  MethodPicker: undefined;
  ManualWizardStep1: undefined;
  ManualWizardStep2: { step1Data: ManualStep1Data };
  ManualWizardStep3: { step1Data: ManualStep1Data; ingredients: Ingredient[] };
  ImageCapture: undefined;
  UrlInput: undefined;
  // initialText: text the URL screen hands over when the user pasted a caption
  // into the URL box by mistake
  FreeTextInput: { initialText?: string } | undefined;
  AiIdeasInput: undefined;
  // Results fetch from `request` themselves; `savedOptionId` is merged back in
  // by RecipeReview after a save so the matching card can show as saved.
  AiIdeasResults: { request: AiRecipeRequest; savedOptionId?: string };
  RecipeReview: {
    partialRecipe: Partial<Recipe>;
    handwrittenRecipeImg?: string;
    recipeLink?: string;
    // Set only when the draft came from an AI option; save then returns to
    // the results screen instead of resetting to MethodPicker
    aiOrigin?: { optionId: string; request: AiRecipeRequest };
  };
};

const Stack = createNativeStackNavigator<AddRecipeStackParamList>();

export default function AddRecipeStack() {
  const colors = useThemeColors();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background.default },
      }}
    >
      <Stack.Screen name="MethodPicker" component={MethodPickerScreenContainer} />
      <Stack.Screen name="ManualWizardStep1" component={ManualWizardStep1ScreenContainer} />
      <Stack.Screen name="ManualWizardStep2" component={ManualWizardStep2ScreenContainer} />
      <Stack.Screen name="ManualWizardStep3" component={ManualWizardStep3ScreenContainer} />
      <Stack.Screen name="ImageCapture" component={ImageCaptureScreenContainer} />
      <Stack.Screen name="UrlInput" component={UrlInputScreenContainer} />
      <Stack.Screen name="FreeTextInput" component={FreeTextInputScreenContainer} />
      <Stack.Screen name="AiIdeasInput" component={AiIdeasInputScreenContainer} />
      <Stack.Screen name="AiIdeasResults" component={AiIdeasResultsScreenContainer} />
      <Stack.Screen name="RecipeReview" component={RecipeReviewScreenContainer} />
    </Stack.Navigator>
  );
}
