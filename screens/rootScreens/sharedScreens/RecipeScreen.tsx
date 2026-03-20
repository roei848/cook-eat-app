import React, { useLayoutEffect, useState } from "react";
import { Alert, Pressable, Text } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";

import { RootState } from "../../../store/store";
import { Recipe } from "../../../types/recipe";
import { useThemeColors } from "../../../theme/useThemeColors";

import RecipeView from "../../../components/recipe/RecipeView";
import RecipeEdit from "../../../components/recipe/RecipeEdit";
import RecipeNotes from "../../../components/recipe/RecipeNotes";

type RecipeMode = "view" | "edit" | "notes";

type Props = NativeStackScreenProps<any, any>; // adapt to your stack later

export default function RecipeScreen({ navigation, route }: Props) {
  const { recipe } = route.params as { recipe: Recipe };
  const colors = useThemeColors();

  const [mode, setMode] = useState<RecipeMode>("view");
  const [draftRecipe, setDraftRecipe] = useState<Recipe | null>(null);
  const [draftNotes, setDraftNotes] = useState<string[]>([]);

  // ───────────────── Header logic ─────────────────
  useLayoutEffect(() => {
    if (!recipe) return;

    if (mode === "view") {
      navigation.setOptions({
        title: "",
        headerTransparent: true,
        headerTintColor: "#FFFFFF",
        headerShadowVisible: false,
        headerLeft: () => null,
        headerRight: () => (
          <>
            <TextButton
              label="עריכה"
              onPress={() => {
                setDraftRecipe({ ...recipe });
                setMode("edit");
              }}
            />
            <TextButton
              label="הערות"
              onPress={() => {
                setDraftNotes(recipe.notes ?? []);
                setMode("notes");
              }}
            />
          </>
        ),
      });
    }

    if (mode === "edit") {
      navigation.setOptions({
        title: "עריכת מתכון",
        headerTransparent: false,
        headerTintColor: colors.header.text,
        headerShadowVisible: true,
        headerLeft: () => (
          <TextButton label="ביטול" onPress={() => setMode("view")} />
        ),
        headerRight: () => (
          <TextButton
            label="שמור"
            onPress={() => {
              // 🔜 dispatch updateRecipe
              setMode("view");
            }}
          />
        ),
      });
    }

    if (mode === "notes") {
      navigation.setOptions({
        title: "הערות",
        headerTransparent: false,
        headerTintColor: colors.header.text,
        headerShadowVisible: true,
        headerLeft: () => (
          <TextButton label="ביטול" onPress={() => setMode("view")} />
        ),
        headerRight: () => (
          <TextButton
            label="שמור"
            onPress={() => {
              // 🔜 dispatch updateRecipeNotes
              setMode("view");
            }}
          />
        ),
      });
    }
  }, [mode, navigation, recipe]);

  if (!recipe) return null;

  // ───────────────── Render modes ─────────────────
  if (mode === "edit" && draftRecipe) {
    return <RecipeEdit recipe={draftRecipe} onChange={setDraftRecipe} />;
  }

  if (mode === "notes") {
    return <RecipeNotes notes={draftNotes} onChange={setDraftNotes} />;
  }

  return <RecipeView recipe={recipe} />;
}

/** Simple header button */
function TextButton({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  const colors = useThemeColors();
  return (
    <Pressable onPress={onPress} style={{ marginHorizontal: 8 }}>
      <Text style={{ color: colors.primary[500], fontWeight: "600" }}>
        {label}
      </Text>
    </Pressable>
  );
}
