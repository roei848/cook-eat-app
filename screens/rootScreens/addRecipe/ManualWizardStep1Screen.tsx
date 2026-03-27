import React from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";

import Screen from "../../Screen";
import { ThemeColors } from "../../../theme/colors";
import { useThemeColors } from "../../../theme/useThemeColors";
import { Category } from "../../../types/enums/category";
import { Difficulty } from "../../../types/enums/diffucalty";
import { Relative } from "../../../types/enums/relatives";

import WizardProgressBar from "../../../components/recipe/form/WizardProgressBar";
import CategoryPicker from "../../../components/recipe/form/CategoryPicker";
import DifficultyPicker from "../../../components/recipe/form/DifficultyPicker";
import RelativesPicker from "../../../components/recipe/form/RelativesPicker";
import Button from "../../../components/ui/Button";

interface ManualWizardStep1ScreenProps {
  title: string;
  description: string;
  category: Category;
  difficulty: Difficulty;
  timeInMinutes: string;
  byWho: string;
  relatives: Relative[];
  onTitleChange: (v: string) => void;
  onDescriptionChange: (v: string) => void;
  onCategoryChange: (v: Category) => void;
  onDifficultyChange: (v: Difficulty) => void;
  onTimeChange: (v: string) => void;
  onByWhoChange: (v: string) => void;
  onRelativesChange: (v: Relative[]) => void;
  onNext: () => void;
}

export default function ManualWizardStep1Screen({
  title,
  description,
  category,
  difficulty,
  timeInMinutes,
  byWho,
  relatives,
  onTitleChange,
  onDescriptionChange,
  onCategoryChange,
  onDifficultyChange,
  onTimeChange,
  onByWhoChange,
  onRelativesChange,
  onNext,
}: ManualWizardStep1ScreenProps) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  return (
    <Screen>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.flex}
      >
        <WizardProgressBar currentStep={1} />
        <Text style={styles.stepLabel}>שלב 1 מתוך 3 — פרטים בסיסיים</Text>

        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={onTitleChange}
            placeholder="שם המתכון *"
            placeholderTextColor={colors.text.muted}
            textAlign="right"
          />

          <TextInput
            style={[styles.input, styles.inputMultiline]}
            value={description}
            onChangeText={onDescriptionChange}
            placeholder="תיאור קצר *"
            placeholderTextColor={colors.text.muted}
            multiline
            textAlign="right"
          />

          <CategoryPicker value={category} onChange={onCategoryChange} />
          <DifficultyPicker value={difficulty} onChange={onDifficultyChange} />

          <TextInput
            style={styles.input}
            value={timeInMinutes}
            onChangeText={onTimeChange}
            placeholder="זמן הכנה (דקות) *"
            placeholderTextColor={colors.text.muted}
            keyboardType="number-pad"
            textAlign="right"
          />

          <TextInput
            style={styles.input}
            value={byWho}
            onChangeText={onByWhoChange}
            placeholder="מאת"
            placeholderTextColor={colors.text.muted}
            textAlign="right"
          />

          <RelativesPicker value={relatives} onChange={onRelativesChange} />
        </ScrollView>

        <View style={styles.footer}>
          <Button title="הבא ›" onPress={onNext} />
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    flex: { flex: 1 },
    stepLabel: {
      fontSize: 13,
      color: colors.text.muted,
      textAlign: "right",
      paddingHorizontal: 16,
      marginBottom: 12,
    },
    content: {
      paddingHorizontal: 16,
      paddingBottom: 24,
    },
    input: {
      backgroundColor: colors.card.default,
      borderWidth: 1,
      borderColor: colors.border.default,
      borderRadius: 12,
      paddingVertical: 14,
      paddingHorizontal: 16,
      fontSize: 15,
      color: colors.text.primary,
      marginBottom: 12,
    },
    inputMultiline: {
      minHeight: 80,
      textAlignVertical: "top",
    },
    footer: {
      padding: 16,
      paddingBottom: 24,
    },
  });
