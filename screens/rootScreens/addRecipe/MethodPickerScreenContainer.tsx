import React from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { AddRecipeStackParamList } from "./AddRecipeStack";
import MethodPickerScreen from "./MethodPickerScreen";

type Nav = NativeStackNavigationProp<AddRecipeStackParamList>;

export default function MethodPickerScreenContainer() {
  const navigation = useNavigation<Nav>();

  return (
    <MethodPickerScreen
      onSelectManual={() => navigation.navigate("ManualWizardStep1")}
      onSelectImage={() => navigation.navigate("ImageCapture")}
      onSelectUrl={() => navigation.navigate("UrlInput")}
    />
  );
}
