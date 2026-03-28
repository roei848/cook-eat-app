import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

import Screen from "../../Screen";
import { ThemeColors } from "../../../theme/colors";
import { useThemeColors } from "../../../theme/useThemeColors";
import { Recipe } from "../../../types/recipe";

import RecipeReviewCard from "../../../components/recipe/review/RecipeReviewCard";

interface RecipeReviewScreenProps {
  recipe: Partial<Recipe>;
  isSaving: boolean;
  photoUri?: string;
  onUpdateRecipe: (updates: Partial<Recipe>) => void;
  onPhotoSelected: (uri: string) => void;
  onSave: () => void;
}

export default function RecipeReviewScreen({
  recipe,
  isSaving,
  photoUri,
  onUpdateRecipe,
  onPhotoSelected,
  onSave,
}: RecipeReviewScreenProps) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>בדוק ועדכן</Text>
          <Text style={styles.subtitle}>
            שדות עם מסגרת כתומה ניתנים לעריכה בלחיצה. שדות עם רקע צהוב דורשים
            השלמה.
          </Text>
        </View>

        <RecipeReviewCard
          recipe={recipe}
          onUpdateRecipe={onUpdateRecipe}
          photoUri={photoUri}
          onPhotoSelected={onPhotoSelected}
        />

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
            onPress={onSave}
            disabled={isSaving}
            activeOpacity={0.85}
          >
            {isSaving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>שמור מתכון</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 16,
    },
    header: {
      marginBottom: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: "800",
      color: colors.text.primary,
    },
    subtitle: {
      fontSize: 13,
      color: colors.text.muted,
      marginTop: 4,
      lineHeight: 18,
    },
    footer: {
      paddingTop: 12,
      paddingBottom: 8,
    },
    saveButton: {
      backgroundColor: colors.primary[500],
      paddingVertical: 16,
      borderRadius: 14,
      alignItems: "center",
      shadowColor: colors.primary[500],
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
      elevation: 6,
    },
    saveButtonDisabled: {
      opacity: 0.6,
    },
    saveButtonText: {
      fontSize: 16,
      fontWeight: "700",
      color: "#fff",
    },
  });
