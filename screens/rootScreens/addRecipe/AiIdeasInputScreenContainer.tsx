import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { AddRecipeStackParamList } from "./AddRecipeStack";
import { AiIdeasMode } from "../../../types/aiIdeas";
import { Category } from "../../../types/enums/category";
import { Relative } from "../../../types/enums/relatives";
import {
  addIngredientChip,
  AiIdeasInputError,
  buildAiRecipeRequest,
  STAPLE_SUGGESTIONS,
} from "../../../utils/aiRecipeIdeas";
import AiIdeasInputScreen from "./AiIdeasInputScreen";

type Nav = NativeStackNavigationProp<AddRecipeStackParamList>;

export default function AiIdeasInputScreenContainer() {
  const navigation = useNavigation<Nav>();

  const [mode, setMode] = useState<AiIdeasMode>("fridge");
  // Both drafts are kept so switching modes never throws away typed input
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [wish, setWish] = useState("");
  const [category, setCategory] = useState<Category | undefined>();
  const [relatives, setRelatives] = useState<Relative[]>([]);
  const [maxTimeText, setMaxTimeText] = useState("");
  const [constraintsOpen, setConstraintsOpen] = useState(false);
  const [error, setError] = useState<AiIdeasInputError | undefined>();

  function handleModeChange(next: AiIdeasMode) {
    setMode(next);
    setError(undefined);
  }

  function handleAddIngredient(name: string) {
    const result = addIngredientChip(ingredients, name);
    setIngredients(result.ingredients);
    setError(result.error ? { message: result.error, field: "ingredients" } : undefined);
  }

  function handleRemoveIngredient(name: string) {
    setIngredients((prev) => prev.filter((item) => item !== name));
    setError(undefined);
  }

  // CategoryPicker has no deselect of its own — tapping the selected tile clears it
  function handleToggleCategory(next: Category) {
    setCategory((prev) => (prev === next ? undefined : next));
  }

  function handleSubmit() {
    // Hardware back / swipe-back stay live; don't push results over whatever
    // the user navigated to in the meantime.
    if (!navigation.isFocused()) return;

    const result = buildAiRecipeRequest({
      mode,
      ingredients,
      wish,
      category,
      relatives,
      maxTimeText,
    });
    if ("error" in result) {
      setError({ message: result.error, field: result.field });
      // A time error inside a collapsed section would be invisible
      if (result.field === "maxTime") setConstraintsOpen(true);
      return;
    }

    setError(undefined);
    navigation.navigate("AiIdeasResults", { request: result.request });
  }

  return (
    <AiIdeasInputScreen
      mode={mode}
      ingredients={ingredients}
      suggestions={STAPLE_SUGGESTIONS}
      wish={wish}
      category={category}
      relatives={relatives}
      maxTimeText={maxTimeText}
      constraintsOpen={constraintsOpen}
      error={error}
      onModeChange={handleModeChange}
      onAddIngredient={handleAddIngredient}
      onRemoveIngredient={handleRemoveIngredient}
      onWishChange={(value) => {
        setWish(value);
        setError(undefined);
      }}
      onToggleCategory={handleToggleCategory}
      onRelativesChange={setRelatives}
      onMaxTimeChange={(value) => {
        setMaxTimeText(value);
        setError(undefined);
      }}
      onToggleConstraints={() => setConstraintsOpen((open) => !open)}
      onSubmit={handleSubmit}
      onBack={() => navigation.goBack()}
    />
  );
}
