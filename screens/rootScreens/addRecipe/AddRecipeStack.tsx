import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Ingredient, Recipe } from "../../../types/recipe";
import { Category } from "../../../types/enums/category";
import { Difficulty } from "../../../types/enums/diffucalty";
import { Relative } from "../../../types/enums/relatives";
import { useThemeColors } from "../../../theme/useThemeColors";

import MethodPickerScreenContainer from "./MethodPickerScreenContainer";
import ManualWizardStep1ScreenContainer from "./ManualWizardStep1ScreenContainer";
import ManualWizardStep2ScreenContainer from "./ManualWizardStep2ScreenContainer";
import ManualWizardStep3ScreenContainer from "./ManualWizardStep3ScreenContainer";
import ImageCaptureScreenContainer from "./ImageCaptureScreenContainer";
import UrlInputScreenContainer from "./UrlInputScreenContainer";
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
  RecipeReview: {
    partialRecipe: Partial<Recipe>;
    handwrittenRecipeImg?: string;
    recipeLink?: string;
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
      <Stack.Screen name="RecipeReview" component={RecipeReviewScreenContainer} />
    </Stack.Navigator>
  );
}
