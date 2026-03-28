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
import { Step } from "../../../types/recipe";

import WizardProgressBar from "../../../components/recipe/form/WizardProgressBar";
import StepEditor from "../../../components/recipe/form/StepEditor";
import RecipePhotoInput from "../../../components/recipe/form/RecipePhotoInput";
import Button from "../../../components/ui/Button";

interface ManualWizardStep3ScreenProps {
  steps: Step[];
  photoUri?: string;
  isSaving: boolean;
  onStepsChange: (steps: Step[]) => void;
  onPhotoSelected: (uri: string) => void;
  onSave: () => void;
  onBack: () => void;
}

export default function ManualWizardStep3Screen({
  steps,
  photoUri,
  isSaving,
  onStepsChange,
  onPhotoSelected,
  onSave,
  onBack,
}: ManualWizardStep3ScreenProps) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  return (
    <Screen>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.flex}
      >
        <WizardProgressBar currentStep={3} onBack={onBack} />
        <Text style={styles.stepLabel}>שלב 3 מתוך 3 — שלבי הכנה ותמונה</Text>

        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <StepEditor steps={steps} onChange={onStepsChange} />

          <Text style={styles.sectionTitle}>תמונה (אופציונלי)</Text>
          <RecipePhotoInput imageUri={photoUri} onImageSelected={onPhotoSelected} />
        </ScrollView>

        <View style={styles.footer}>
          <Button title="שמור" onPress={onSave} loading={isSaving} />
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
      paddingHorizontal: 16,
      marginBottom: 12,
    },
    content: {
      paddingHorizontal: 16,
      paddingBottom: 24,
    },
    sectionTitle: {
      fontSize: 15,
      fontWeight: "600",
      color: colors.text.primary,
      marginTop: 20,
      marginBottom: 10,
    },
    footer: {
      padding: 16,
      paddingBottom: 24,
    },
  });
