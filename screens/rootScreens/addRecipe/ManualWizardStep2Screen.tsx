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
import { Ingredient } from "../../../types/recipe";

import WizardProgressBar from "../../../components/recipe/form/WizardProgressBar";
import IngredientEditor from "../../../components/recipe/form/IngredientEditor";
import Button from "../../../components/ui/Button";
import FlatButton from "../../../components/ui/FlatButton";

interface ManualWizardStep2ScreenProps {
  ingredients: Ingredient[];
  onIngredientsChange: (ingredients: Ingredient[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function ManualWizardStep2Screen({
  ingredients,
  onIngredientsChange,
  onNext,
  onBack,
}: ManualWizardStep2ScreenProps) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  return (
    <Screen>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.flex}
      >
        <WizardProgressBar currentStep={2} />
        <Text style={styles.stepLabel}>שלב 2 מתוך 3 — רכיבים</Text>

        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <IngredientEditor
            ingredients={ingredients}
            onChange={onIngredientsChange}
          />
        </ScrollView>

        <View style={styles.footer}>
          <FlatButton title="‹ חזור" onPress={onBack} />
          <Button title="הבא ›" onPress={onNext} style={styles.nextButton} />
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
    footer: {
      flexDirection: "row",
      padding: 16,
      paddingBottom: 24,
      gap: 12,
      alignItems: "center",
    },
    nextButton: {
      flex: 1,
    },
  });
