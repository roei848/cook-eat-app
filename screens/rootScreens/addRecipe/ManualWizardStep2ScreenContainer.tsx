import React, { useState } from "react";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { Ingredient } from "../../../types/recipe";
import { AddRecipeStackParamList } from "./AddRecipeStack";
import ManualWizardStep2Screen from "./ManualWizardStep2Screen";

type Nav = NativeStackNavigationProp<AddRecipeStackParamList>;
type Route = RouteProp<AddRecipeStackParamList, "ManualWizardStep2">;

export default function ManualWizardStep2ScreenContainer() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { step1Data } = route.params;

  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: "", amount: "" },
  ]);

  function handleNext() {
    navigation.navigate("ManualWizardStep3", { step1Data, ingredients });
  }

  function handleBack() {
    navigation.goBack();
  }

  return (
    <ManualWizardStep2Screen
      ingredients={ingredients}
      onIngredientsChange={setIngredients}
      onNext={handleNext}
      onBack={handleBack}
    />
  );
}
