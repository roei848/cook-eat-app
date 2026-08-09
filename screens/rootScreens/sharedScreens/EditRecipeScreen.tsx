import React, { useState } from "react";
import { ActivityIndicator, Platform, StyleSheet, Text, View } from "react-native";
// RNGH ScrollView so the StepEditor drag gesture can block scrolling
import { ScrollView } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";

import Screen from "../../Screen";
import { ThemeColors } from "../../../theme/colors";
import { useThemeColors } from "../../../theme/useThemeColors";
import { typography } from "../../../theme/typography";
import { radius, spacing, SCREEN_PADDING_H } from "../../../theme/spacing";
import { withAlpha } from "../../../theme/categoryColors";
import { useTabBarClearance } from "../../../theme/layout";
import { RootState } from "../../../store/store";
import { Recipe } from "../../../types/recipe";
import { RecipeValidationErrors } from "../../../utils/recipeValidation";

import RecipeForm from "../../../components/recipe/form/RecipeForm";
import { ScrollLockContext } from "../../../components/recipe/form/scrollLockContext";
import HeaderTextButton from "../../../components/ui/HeaderTextButton";
import ScalePressable from "../../../components/ui/ScalePressable";

interface EditRecipeScreenProps {
  draft: Partial<Recipe>;
  photoUri?: string;
  errors?: RecipeValidationErrors;
  isSaving: boolean;
  onChange: (patch: Partial<Recipe>) => void;
  onPhotoSelected: (uri: string) => void;
  onCancel: () => void;
  onSave: () => void;
  onDeletePress: () => void;
}

export default function EditRecipeScreen({
  draft,
  photoUri,
  errors,
  isSaving,
  onChange,
  onPhotoSelected,
  onCancel,
  onSave,
  onDeletePress,
}: EditRecipeScreenProps) {
  const colors = useThemeColors();
  const isDark = useSelector(
    (state: RootState) => state.user.profile?.darkMode ?? false
  );
  const styles = createStyles(colors, isDark);
  const tabBarClearance = useTabBarClearance();
  // Frozen while a StepEditor row is being drag-reordered
  const [scrollLocked, setScrollLocked] = useState(false);

  return (
    <Screen>
      {/* In-screen header — the wizard-chrome pattern (headerShown: false) */}
      <View style={styles.headerBar}>
        <HeaderTextButton label="ביטול" onPress={onCancel} />
        <Text style={styles.headerTitle}>עריכת מתכון</Text>
        {isSaving ? (
          <ActivityIndicator
            size="small"
            color={colors.primary[500]}
            style={styles.headerSpinner}
          />
        ) : (
          <HeaderTextButton label="שמור" prominent onPress={onSave} />
        )}
      </View>

      <ScrollLockContext.Provider value={setScrollLocked}>
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[styles.content, { paddingBottom: tabBarClearance }]}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets={Platform.OS === "ios"}
          scrollEnabled={!scrollLocked}
        >
          <RecipeForm
            value={draft}
            onChange={onChange}
            photoUri={photoUri}
            onPhotoSelected={onPhotoSelected}
            errors={errors}
          />

          <ScalePressable
            onPress={onDeletePress}
            style={styles.deleteButton}
            accessibilityRole="button"
          >
            <Ionicons name="trash-outline" size={18} color={colors.danger[500]} />
            <Text style={styles.deleteText}>מחיקת מתכון</Text>
          </ScalePressable>
        </ScrollView>
      </ScrollLockContext.Provider>
    </Screen>
  );
}

const createStyles = (colors: ThemeColors, isDark: boolean) =>
  StyleSheet.create({
    flex: {
      flex: 1,
    },
    headerBar: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: SCREEN_PADDING_H - 8,
      marginBottom: spacing.lg,
    },
    headerTitle: {
      ...typography.titleL,
      color: colors.text.primary,
    },
    headerSpinner: {
      marginHorizontal: spacing.sm,
    },
    content: {
      paddingHorizontal: SCREEN_PADDING_H,
    },
    deleteButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.sm,
      width: "100%",
      paddingVertical: 14,
      borderRadius: radius.sm,
      backgroundColor: withAlpha(colors.danger[500], isDark ? 0.16 : 0.08),
      marginTop: spacing.md,
    },
    deleteText: {
      ...typography.button,
      color: colors.danger[500],
    },
  });
