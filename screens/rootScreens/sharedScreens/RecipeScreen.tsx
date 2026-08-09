import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, Pressable } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";

import { RootState } from "../../../store/store";
import { useThemeColors } from "../../../theme/useThemeColors";
import { updateRecipe } from "../../../services/firebase/recipeService";

import RecipeView from "../../../components/recipe/RecipeView";
import RecipeNotes from "../../../components/recipe/RecipeNotes";
import HeaderTextButton from "../../../components/ui/HeaderTextButton";
import { SharedRecipeParams } from "./sharedRecipeRoutes";

type RecipeMode = "view" | "notes";

type Props = NativeStackScreenProps<SharedRecipeParams, "Recipe">;

export default function RecipeScreen({ navigation, route }: Props) {
  const { recipeId } = route.params;
  const colors = useThemeColors();

  // Selected from Redux (kept fresh by the Firestore onSnapshot subscription),
  // so the view re-renders with saved edits immediately.
  const recipe = useSelector((state: RootState) =>
    state.recipes.items.find((r) => r.id === recipeId)
  );

  const [mode, setMode] = useState<RecipeMode>("view");
  const [draftNotes, setDraftNotes] = useState<string[]>([]);
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  // Header closures read the ref so setOptions doesn't re-run per keystroke
  const draftNotesRef = useRef(draftNotes);
  draftNotesRef.current = draftNotes;

  // Recipe deleted while this screen is mounted → leave.
  // isFocused() avoids a double-pop race with EditRecipe's popToTop.
  useEffect(() => {
    if (!recipe && navigation.isFocused()) {
      navigation.goBack();
    }
  }, [recipe, navigation]);

  // ───────────────── Header logic ─────────────────
  useLayoutEffect(() => {
    if (!recipe) return;

    if (mode === "view") {
      navigation.setOptions({
        title: "",
        headerTransparent: true,
        headerTintColor: "#FFFFFF",
        headerShadowVisible: false,
        headerLeft: () => (
          <Pressable onPress={() => navigation.goBack()} style={{ padding: 8 }}>
            <Ionicons name="chevron-back-outline" size={28} color={colors.primary[500]} />
          </Pressable>
        ),
        headerRight: () => (
          <>
            <HeaderTextButton
              label="עריכה"
              onPress={() => navigation.navigate("EditRecipe", { recipeId })}
            />
            <HeaderTextButton
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

    if (mode === "notes") {
      navigation.setOptions({
        title: "הערות",
        headerTransparent: false,
        headerTintColor: colors.header.text,
        headerShadowVisible: true,
        headerLeft: () => (
          <HeaderTextButton label="ביטול" onPress={() => setMode("view")} />
        ),
        headerRight: () =>
          isSavingNotes ? (
            <ActivityIndicator
              size="small"
              color={colors.primary[500]}
              style={{ marginHorizontal: 8 }}
            />
          ) : (
            <HeaderTextButton
              label="שמור"
              prominent
              onPress={async () => {
                setIsSavingNotes(true);
                try {
                  await updateRecipe(recipeId, { notes: draftNotesRef.current });
                  setMode("view");
                } catch (error) {
                  Alert.alert("שמירה נכשלה", "נסה שוב");
                } finally {
                  setIsSavingNotes(false);
                }
              }}
            />
          ),
      });
    }
  }, [mode, navigation, recipe, recipeId, isSavingNotes, colors]);

  if (!recipe) return null;

  // ───────────────── Render modes ─────────────────
  if (mode === "notes") {
    return <RecipeNotes notes={draftNotes} onChange={setDraftNotes} />;
  }

  return <RecipeView recipe={recipe} />;
}
