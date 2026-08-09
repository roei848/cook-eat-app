import React from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

import Screen from "../../Screen";
import { ThemeColors } from "../../../theme/colors";
import { useThemeColors } from "../../../theme/useThemeColors";
import { typography } from "../../../theme/typography";
import { spacing, SCREEN_PADDING_H } from "../../../theme/spacing";
import { useTabBarClearance } from "../../../theme/layout";
import { Ingredient } from "../../../types/recipe";

import WizardProgressBar from "../../../components/recipe/form/WizardProgressBar";
import FormSection from "../../../components/recipe/form/FormSection";
import IngredientEditor from "../../../components/recipe/form/IngredientEditor";
import Button from "../../../components/ui/Button";

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
  const tabBarClearance = useTabBarClearance();

  return (
    <Screen>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.flex}
      >
        <WizardProgressBar currentStep={2} onBack={onBack} />

        <View style={styles.headerBlock}>
          <Text style={styles.stepTitle}>מצרכים</Text>
          <Text style={styles.stepCounter}>שלב 2 מתוך 3</Text>
        </View>

        <ScrollView
          style={styles.flex}
          contentContainerStyle={[styles.content, { paddingBottom: tabBarClearance }]}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View entering={FadeInUp.delay(200)}>
            <FormSection icon="basket-outline" title="מצרכים">
              <IngredientEditor
                ingredients={ingredients}
                onChange={onIngredientsChange}
              />
            </FormSection>
          </Animated.View>

          <Button title="הבא" onPress={onNext} style={styles.cta} />
        </ScrollView>
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
    cta: {
      marginTop: spacing.sm,
    },
  });
