import React, { useState } from "react";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";

import { RootState } from "../../../store/store";
import { Category } from "../../../types/enums/category";
import { Difficulty } from "../../../types/enums/diffucalty";
import { Relative } from "../../../types/enums/relatives";
import { validateRecipeFields } from "../../../utils/recipeValidation";
import { AddRecipeStackParamList, ManualStep1Data } from "./AddRecipeStack";
import ManualWizardStep1Screen from "./ManualWizardStep1Screen";

type Nav = NativeStackNavigationProp<AddRecipeStackParamList>;

export default function ManualWizardStep1ScreenContainer() {
  const navigation = useNavigation<Nav>();
  const userName = useSelector(
    (state: RootState) => state.user.profile?.name ?? ""
  );

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category>(Category.MAIN_COURSE);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.MEDIUM);
  const [timeInMinutes, setTimeInMinutes] = useState("");
  const [byWho, setByWho] = useState(userName);
  const [relatives, setRelatives] = useState<Relative[]>([]);

  function handleBack() {
    navigation.goBack();
  }

  function handleNext() {
    const time = parseInt(timeInMinutes, 10);
    const errors = validateRecipeFields(
      { title, description, timeInMinutes: isNaN(time) ? undefined : time },
      ["title", "description", "timeInMinutes"]
    );
    if (Object.keys(errors).length > 0) {
      Alert.alert("שגיאה", Object.values(errors).join("\n"));
      return;
    }

    const step1Data: ManualStep1Data = {
      title: title.trim(),
      description: description.trim(),
      category,
      difficulty,
      timeInMinutes: time,
      byWho: byWho.trim() || userName,
      relatives,
    };

    navigation.navigate("ManualWizardStep2", { step1Data });
  }

  return (
    <ManualWizardStep1Screen
      title={title}
      description={description}
      category={category}
      difficulty={difficulty}
      timeInMinutes={timeInMinutes}
      byWho={byWho}
      relatives={relatives}
      onTitleChange={setTitle}
      onDescriptionChange={setDescription}
      onCategoryChange={setCategory}
      onDifficultyChange={setDifficulty}
      onTimeChange={setTimeInMinutes}
      onByWhoChange={setByWho}
      onRelativesChange={setRelatives}
      onBack={handleBack}
      onNext={handleNext}
    />
  );
}
