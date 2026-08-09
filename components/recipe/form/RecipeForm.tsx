import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

import { Recipe } from "../../../types/recipe";
import { ThemeColors } from "../../../theme/colors";
import { useThemeColors } from "../../../theme/useThemeColors";
import { typography } from "../../../theme/typography";
import { radius, spacing } from "../../../theme/spacing";
import { withAlpha } from "../../../theme/categoryColors";
import { RecipeValidationErrors } from "../../../utils/recipeValidation";

import FormSection from "./FormSection";
import CategoryPicker from "./CategoryPicker";
import DifficultyPicker from "./DifficultyPicker";
import RelativesPicker from "./RelativesPicker";
import IngredientEditor from "./IngredientEditor";
import StepEditor from "./StepEditor";
import RecipePhotoInput from "./RecipePhotoInput";
import TimeInput from "./TimeInput";
import Input from "../../ui/Input";

export interface RecipeFormProps {
  /** Works for both consumers — a full Recipe satisfies Partial<Recipe>. */
  value: Partial<Recipe>;
  /** Patch-merge: containers do setDraft(prev => ({...prev, ...patch})). */
  onChange: (patch: Partial<Recipe>) => void;
  /** Local uri picked this session, not yet uploaded. Shown over value.imageUrl. */
  photoUri?: string;
  onPhotoSelected: (uri: string) => void;
  /** Amber "needs completion" highlighting for empty required fields (AI review flow). */
  highlightMissing?: boolean;
  /** Danger styling after a failed save attempt. Wins over the amber state. */
  errors?: RecipeValidationErrors;
}

/**
 * Shared all-fields recipe form — used by the EditRecipe screen and the
 * add-wizard's review step. Plain View stack: parents own the ScrollView,
 * keyboard handling, bottom clearance, and footer actions.
 */
export default function RecipeForm({
  value,
  onChange,
  photoUri,
  onPhotoSelected,
  highlightMissing = false,
  errors,
}: RecipeFormProps) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const missingTitle = highlightMissing && !value.title?.trim();
  const missingDescription = highlightMissing && !value.description?.trim();
  const missingByWho = highlightMissing && !value.byWho?.trim();
  const missingCategory = highlightMissing && !value.category;
  const missingDifficulty = highlightMissing && !value.difficulty;
  const missingTime =
    highlightMissing && !(value.timeInMinutes && value.timeInMinutes > 0);
  const missingIngredients =
    highlightMissing && !value.ingredients?.some((i) => i.name.trim());
  const missingSteps = highlightMissing && !value.steps?.some((s) => s.text.trim());

  function handleTimeChange(text: string) {
    const parsed = parseInt(text, 10);
    onChange({ timeInMinutes: isNaN(parsed) ? undefined : parsed });
  }

  function renderPickerHint(error?: string, missing?: boolean, missingText?: string) {
    if (error) {
      return <Text style={styles.errorHint}>{error}</Text>;
    }
    if (missing) {
      return (
        <View style={styles.missingHint}>
          <Ionicons
            name="alert-circle-outline"
            size={14}
            color={colors.accent.amberText}
          />
          <Text style={styles.missingHintText}>{missingText ?? "שדה חובה"}</Text>
        </View>
      );
    }
    return null;
  }

  return (
    <View>
      {/* Photo — photo-led, mirrors the recipe view hero */}
      <Animated.View entering={FadeInUp.delay(200)} style={styles.photoBlock}>
        <RecipePhotoInput
          imageUri={photoUri ?? value.imageUrl}
          onImageSelected={onPhotoSelected}
        />
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(300)}>
        <FormSection icon="reader-outline" title="פרטים">
          <Input
            label="שם המתכון"
            value={value.title ?? ""}
            onChangeText={(title) => onChange({ title })}
            placeholder="למשל שקשוקה ביתית"
            missing={missingTitle}
            error={errors?.title}
          />
          <Input
            label="תיאור קצר"
            value={value.description ?? ""}
            onChangeText={(description) => onChange({ description })}
            placeholder="כמה מילים על המתכון"
            multiline
            style={styles.multiline}
            missing={missingDescription}
            error={errors?.description}
          />
          <Input
            label="מאת"
            value={value.byWho ?? ""}
            onChangeText={(byWho) => onChange({ byWho })}
            placeholder="שם המכין"
            missing={missingByWho}
            error={errors?.byWho}
          />
          <Input
            label="קישור למתכון"
            value={value.recipeLink ?? ""}
            onChangeText={(recipeLink) => onChange({ recipeLink })}
            placeholder="https://"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            // URL content is Latin/LTR by nature — the one legitimate LTR input
            textAlign="left"
          />
        </FormSection>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(400)}>
        <FormSection icon="options-outline" title="מאפיינים">
          <View>
            <CategoryPicker
              value={value.category}
              onChange={(category) => onChange({ category })}
            />
            {renderPickerHint(errors?.category, missingCategory, "יש לבחור קטגוריה")}
          </View>
          <View>
            <DifficultyPicker
              value={value.difficulty}
              onChange={(difficulty) => onChange({ difficulty })}
            />
            {renderPickerHint(
              errors?.difficulty,
              missingDifficulty,
              "יש לבחור רמת קושי"
            )}
          </View>
          <TimeInput
            value={value.timeInMinutes != null ? String(value.timeInMinutes) : ""}
            onChange={handleTimeChange}
            missing={missingTime}
            error={errors?.timeInMinutes}
          />
          <RelativesPicker
            value={value.relatives ?? []}
            onChange={(relatives) => onChange({ relatives })}
          />
        </FormSection>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(400)}>
        <FormSection icon="basket-outline" title="מצרכים">
          {(missingIngredients || errors?.ingredients) && (
            <View
              style={[
                styles.emptyState,
                errors?.ingredients != null && {
                  backgroundColor: withAlpha(colors.danger[500], 0.08),
                },
              ]}
            >
              <Ionicons
                name="alert-circle-outline"
                size={16}
                color={
                  errors?.ingredients ? colors.danger[500] : colors.accent.amberText
                }
              />
              <Text
                style={[
                  styles.emptyStateText,
                  errors?.ingredients != null && { color: colors.danger[500] },
                ]}
              >
                {errors?.ingredients ?? "לא זוהו מצרכים, יש להוסיף לפחות אחד"}
              </Text>
            </View>
          )}
          <IngredientEditor
            ingredients={value.ingredients ?? []}
            onChange={(ingredients) => onChange({ ingredients })}
          />
        </FormSection>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(400)}>
        <FormSection icon="list-outline" title="שלבי הכנה">
          {(missingSteps || errors?.steps) && (
            <View
              style={[
                styles.emptyState,
                errors?.steps != null && {
                  backgroundColor: withAlpha(colors.danger[500], 0.08),
                },
              ]}
            >
              <Ionicons
                name="alert-circle-outline"
                size={16}
                color={errors?.steps ? colors.danger[500] : colors.accent.amberText}
              />
              <Text
                style={[
                  styles.emptyStateText,
                  errors?.steps != null && { color: colors.danger[500] },
                ]}
              >
                {errors?.steps ?? "לא זוהו שלבים, יש להוסיף לפחות אחד"}
              </Text>
            </View>
          )}
          <StepEditor
            steps={value.steps ?? []}
            onChange={(steps) => onChange({ steps })}
          />
        </FormSection>
      </Animated.View>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    photoBlock: {
      marginBottom: spacing.xl,
    },
    multiline: {
      minHeight: 96,
      textAlignVertical: "top",
    },
    errorHint: {
      ...typography.bodySmall,
      color: colors.danger[500],
      marginTop: -spacing.sm,
      marginBottom: spacing.md,
    },
    missingHint: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      marginTop: -spacing.sm,
      marginBottom: spacing.md,
    },
    missingHintText: {
      ...typography.caption,
      color: colors.accent.amberText,
    },
    emptyState: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      backgroundColor: colors.accent.amberBg,
      borderRadius: radius.sm,
      padding: spacing.md,
      marginBottom: spacing.md,
    },
    emptyStateText: {
      ...typography.bodySmall,
      color: colors.accent.amberText,
      flex: 1,
    },
  });
