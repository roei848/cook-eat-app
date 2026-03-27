import React, { useState } from "react";
import { Alert } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { Step } from "../../../types/recipe";
import { AddRecipeStackParamList } from "./AddRecipeStack";
import { uploadRecipeImage } from "../../../services/firebase/storageService";
import { createRecipe } from "../../../services/firebase/recipeService";
import ManualWizardStep3Screen from "./ManualWizardStep3Screen";

type Nav = NativeStackNavigationProp<AddRecipeStackParamList>;
type Route = RouteProp<AddRecipeStackParamList, "ManualWizardStep3">;

export default function ManualWizardStep3ScreenContainer() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { step1Data, ingredients } = route.params;

  const [steps, setSteps] = useState<Step[]>([{ order: 1, text: "" }]);
  const [photoUri, setPhotoUri] = useState<string | undefined>();
  const [isSaving, setIsSaving] = useState(false);

  async function handleSave() {
    if (steps.length === 0 || steps.every((s) => !s.text.trim())) {
      Alert.alert("שגיאה", "יש להוסיף לפחות שלב הכנה אחד");
      return;
    }

    if (ingredients.every((i) => !i.name.trim())) {
      Alert.alert("שגיאה", "יש להוסיף לפחות רכיב אחד");
      return;
    }

    setIsSaving(true);
    try {
      let imageUrl: string | undefined;
      if (photoUri) {
        imageUrl = await uploadRecipeImage(photoUri);
      }

      const id = await createRecipe({
        ...step1Data,
        ingredients: ingredients.filter((i) => i.name.trim()),
        steps: steps.filter((s) => s.text.trim()),
        imageUrl,
        relatives: step1Data.relatives,
      });

      if (!id) throw new Error("createRecipe returned null");

      navigation.reset({ index: 0, routes: [{ name: "MethodPicker" }] });
    } catch (error) {
      Alert.alert("שמירה נכשלה", "נסה שוב");
    } finally {
      setIsSaving(false);
    }
  }

  function handleBack() {
    navigation.goBack();
  }

  return (
    <ManualWizardStep3Screen
      steps={steps}
      photoUri={photoUri}
      isSaving={isSaving}
      onStepsChange={setSteps}
      onPhotoSelected={setPhotoUri}
      onSave={handleSave}
      onBack={handleBack}
    />
  );
}
