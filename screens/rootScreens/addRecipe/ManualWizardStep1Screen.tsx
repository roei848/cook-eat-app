import React from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";

import Screen from "../../Screen";
import { ThemeColors } from "../../../theme/colors";
import { useThemeColors } from "../../../theme/useThemeColors";
import { typography } from "../../../theme/typography";
import { spacing, SCREEN_PADDING_H } from "../../../theme/spacing";
import { useTabBarClearance } from "../../../theme/layout";
import { Category } from "../../../types/enums/category";
import { Difficulty } from "../../../types/enums/diffucalty";
import { Relative } from "../../../types/enums/relatives";

import WizardProgressBar from "../../../components/recipe/form/WizardProgressBar";
import CategoryPicker from "../../../components/recipe/form/CategoryPicker";
import DifficultyPicker from "../../../components/recipe/form/DifficultyPicker";
import RelativesPicker from "../../../components/recipe/form/RelativesPicker";
import TimeInput from "../../../components/recipe/form/TimeInput";
import Input from "../../../components/ui/Input";
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
  onBack: () => void;
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
  onBack,
  onNext,
}: ManualWizardStep1ScreenProps) {
  const colors = useThemeColors();
  const styles = createStyles(colors);
  const tabBarClearance = useTabBarClearance();

  return (
    <Screen>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.flex}
      >
        <WizardProgressBar currentStep={1} onBack={onBack} />

        <View style={styles.headerBlock}>
          <Text style={styles.stepTitle}>פרטים בסיסיים</Text>
          <Text style={styles.stepCounter}>שלב 1 מתוך 3</Text>
        </View>

        <ScrollView
          style={styles.flex}
          contentContainerStyle={[styles.content, { paddingBottom: tabBarClearance }]}
          keyboardShouldPersistTaps="handled"
        >
          <Input
            label="שם המתכון"
            value={title}
            onChangeText={onTitleChange}
            placeholder="למשל שקשוקה ביתית"
          />

          <Input
            label="תיאור קצר"
            value={description}
            onChangeText={onDescriptionChange}
            placeholder="כמה מילים על המתכון"
            multiline
            style={styles.multiline}
          />

          <CategoryPicker value={category} onChange={onCategoryChange} />
          <DifficultyPicker value={difficulty} onChange={onDifficultyChange} />
          <TimeInput value={timeInMinutes} onChange={onTimeChange} />

          <Input
            label="מאת"
            value={byWho}
            onChangeText={onByWhoChange}
            placeholder="שם המכין"
          />

          <RelativesPicker value={relatives} onChange={onRelativesChange} />

          <Button title="הבא" onPress={onNext} style={styles.cta} />
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    flex: {
      flex: 1,
    },
    headerBlock: {
      paddingHorizontal: SCREEN_PADDING_H,
      marginBottom: spacing.lg,
    },
    stepTitle: {
      ...typography.displayM,
      color: colors.text.primary,
    },
    stepCounter: {
      ...typography.caption,
      color: colors.text.muted,
      marginTop: 2,
    },
    content: {
      paddingHorizontal: SCREEN_PADDING_H,
    },
    multiline: {
      minHeight: 96,
      textAlignVertical: "top",
    },
    cta: {
      marginTop: spacing.xxl,
    },
  });
