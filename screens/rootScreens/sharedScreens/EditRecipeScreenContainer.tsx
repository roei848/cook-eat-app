import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert } from "react-native";
import { usePreventRemove } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";

import { RootState } from "../../../store/store";
import { Recipe } from "../../../types/recipe";
import { deleteRecipe, updateRecipe } from "../../../services/firebase/recipeService";
import { uploadRecipeImage } from "../../../services/firebase/storageService";
import {
  sanitizeRecipeDraft,
  validateRecipe,
} from "../../../utils/recipeValidation";

import EditRecipeScreen from "./EditRecipeScreen";
import { SharedRecipeParams } from "./sharedRecipeRoutes";

type Props = NativeStackScreenProps<SharedRecipeParams, "EditRecipe">;

export default function EditRecipeScreenContainer({ navigation, route }: Props) {
  const { recipeId } = route.params;

  const original = useSelector((state: RootState) =>
    state.recipes.items.find((r) => r.id === recipeId)
  );

  // Seeded once — later snapshot updates must not clobber in-progress edits
  const [draft, setDraft] = useState<Partial<Recipe>>(() => ({ ...original }));
  const [photoUri, setPhotoUri] = useState<string | undefined>();
  const [isSaving, setIsSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Header closures read refs so setOptions doesn't re-run per keystroke
  const draftRef = useRef(draft);
  draftRef.current = draft;
  const photoRef = useRef(photoUri);
  photoRef.current = photoUri;
  // Set when leaving intentionally (after save/delete) to skip the guard
  const closingRef = useRef(false);

  // Danger highlighting only after a failed save attempt, live until fixed
  const errors = useMemo(
    () => (submitted ? validateRecipe(draft).errors : undefined),
    [submitted, draft]
  );

  const isDirty =
    photoUri !== undefined ||
    (original != null && JSON.stringify(draft) !== JSON.stringify({ ...original }));

  usePreventRemove(isDirty && original != null, ({ data }) => {
    if (closingRef.current) {
      navigation.dispatch(data.action);
      return;
    }
    Alert.alert("שינויים לא נשמרו", "לצאת בלי לשמור?", [
      { text: "המשך עריכה", style: "cancel" },
      {
        text: "יציאה",
        style: "destructive",
        onPress: () => navigation.dispatch(data.action),
      },
    ]);
  });

  // Recipe vanished while editing (deleted from another device)
  useEffect(() => {
    if (!original && !closingRef.current && navigation.isFocused()) {
      closingRef.current = true;
      navigation.goBack();
    }
  }, [original, navigation]);

  const handleChange = useCallback((patch: Partial<Recipe>) => {
    setDraft((prev) => ({ ...prev, ...patch }));
  }, []);

  const handleSave = useCallback(async () => {
    const currentDraft = draftRef.current;
    const { valid, errors: validationErrors } = validateRecipe(currentDraft);
    if (!valid) {
      setSubmitted(true);
      Alert.alert("שדות חסרים", Object.values(validationErrors).join("\n"));
      return;
    }

    setIsSaving(true);
    try {
      let imageUrl = currentDraft.imageUrl;
      if (photoRef.current) {
        imageUrl = await uploadRecipeImage(photoRef.current);
      }

      // Editable fields only — never id/createdAt/authorId/notes
      const payload = sanitizeRecipeDraft({
        title: currentDraft.title,
        description: currentDraft.description,
        category: currentDraft.category,
        difficulty: currentDraft.difficulty,
        timeInMinutes: currentDraft.timeInMinutes,
        byWho: currentDraft.byWho,
        relatives: currentDraft.relatives ?? [],
        ingredients: currentDraft.ingredients,
        steps: currentDraft.steps,
        imageUrl,
        recipeLink: currentDraft.recipeLink,
      });

      await updateRecipe(recipeId, payload);

      closingRef.current = true;
      navigation.goBack();
    } catch (error) {
      console.error("Error updating recipe:", error);
      Alert.alert("שמירה נכשלה", "נסה שוב");
    } finally {
      setIsSaving(false);
    }
  }, [navigation, recipeId]);

  const handleDeletePress = useCallback(() => {
    Alert.alert("מחיקת מתכון", "הפעולה תמחק את המתכון לצמיתות. להמשיך?", [
      { text: "ביטול", style: "cancel" },
      {
        text: "מחיקה",
        style: "destructive",
        onPress: async () => {
          try {
            closingRef.current = true;
            await deleteRecipe(recipeId);
            navigation.popToTop();
          } catch (error) {
            closingRef.current = false;
            Alert.alert("מחיקה נכשלה", "נסה שוב");
          }
        },
      },
    ]);
  }, [navigation, recipeId]);

  const handleCancel = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  if (!original && !draft.id) return null;

  return (
    <EditRecipeScreen
      draft={draft}
      photoUri={photoUri}
      errors={errors}
      isSaving={isSaving}
      onChange={handleChange}
      onPhotoSelected={setPhotoUri}
      onCancel={handleCancel}
      onSave={handleSave}
      onDeletePress={handleDeletePress}
    />
  );
}
