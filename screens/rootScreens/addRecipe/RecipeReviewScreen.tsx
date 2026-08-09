import React, { useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
// RNGH ScrollView so the StepEditor drag gesture can block scrolling
import { ScrollView } from "react-native-gesture-handler";

import Screen from "../../Screen";
import { ThemeColors } from "../../../theme/colors";
import { useThemeColors } from "../../../theme/useThemeColors";
import { typography } from "../../../theme/typography";
import { spacing, SCREEN_PADDING_H } from "../../../theme/spacing";
import { useTabBarClearance } from "../../../theme/layout";
import { Recipe } from "../../../types/recipe";
import { RecipeValidationErrors } from "../../../utils/recipeValidation";

import RecipeForm from "../../../components/recipe/form/RecipeForm";
import { ScrollLockContext } from "../../../components/recipe/form/scrollLockContext";
import Button from "../../../components/ui/Button";

interface RecipeReviewScreenProps {
  recipe: Partial<Recipe>;
  isSaving: boolean;
  photoUri?: string;
  errors?: RecipeValidationErrors;
  onUpdateRecipe: (updates: Partial<Recipe>) => void;
  onPhotoSelected: (uri: string) => void;
  onSave: () => void;
}

export default function RecipeReviewScreen({
  recipe,
  isSaving,
  photoUri,
  errors,
  onUpdateRecipe,
  onPhotoSelected,
  onSave,
}: RecipeReviewScreenProps) {
  const colors = useThemeColors();
  const styles = createStyles(colors);
  const tabBarClearance = useTabBarClearance();
  // Frozen while a StepEditor row is being drag-reordered
  const [scrollLocked, setScrollLocked] = useState(false);

  return (
    <Screen>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.flex}
      >
        <View style={styles.headerBlock}>
          <Text style={styles.title}>בדיקה ועדכון</Text>
          <Text style={styles.subtitle}>שדות מסומנים דורשים השלמה לפני השמירה</Text>
        </View>

        <ScrollLockContext.Provider value={setScrollLocked}>
          <ScrollView
            style={styles.flex}
            contentContainerStyle={[styles.content, { paddingBottom: tabBarClearance }]}
            keyboardShouldPersistTaps="handled"
            scrollEnabled={!scrollLocked}
          >
            <RecipeForm
              value={recipe}
              onChange={onUpdateRecipe}
              photoUri={photoUri}
              onPhotoSelected={onPhotoSelected}
              highlightMissing
              errors={errors}
            />

            <Button
              title="שמור מתכון"
              onPress={onSave}
              loading={isSaving}
              style={styles.cta}
            />
          </ScrollView>
        </ScrollLockContext.Provider>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    flex: { flex: 1 },
    headerBlock: {
      paddingHorizontal: SCREEN_PADDING_H,
      marginBottom: spacing.lg,
    },
    title: {
      ...typography.displayM,
      color: colors.text.primary,
    },
    subtitle: {
      ...typography.bodySmall,
      color: colors.text.muted,
      marginTop: 2,
    },
    content: {
      paddingHorizontal: SCREEN_PADDING_H,
    },
    cta: {
      marginTop: spacing.sm,
    },
  });
