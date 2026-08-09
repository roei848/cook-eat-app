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
import Animated, { FadeInUp } from "react-native-reanimated";

import Screen from "../../Screen";
import { ThemeColors } from "../../../theme/colors";
import { useThemeColors } from "../../../theme/useThemeColors";
import { typography } from "../../../theme/typography";
import { spacing, SCREEN_PADDING_H } from "../../../theme/spacing";
import { useTabBarClearance } from "../../../theme/layout";
import { Step } from "../../../types/recipe";

import WizardProgressBar from "../../../components/recipe/form/WizardProgressBar";
import FormSection from "../../../components/recipe/form/FormSection";
import StepEditor from "../../../components/recipe/form/StepEditor";
import RecipePhotoInput from "../../../components/recipe/form/RecipePhotoInput";
import { ScrollLockContext } from "../../../components/recipe/form/scrollLockContext";
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
  const tabBarClearance = useTabBarClearance();
  // Frozen while a StepEditor row is being drag-reordered
  const [scrollLocked, setScrollLocked] = useState(false);

  return (
    <Screen>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.flex}
      >
        <WizardProgressBar currentStep={3} onBack={onBack} />

        <View style={styles.headerBlock}>
          <Text style={styles.stepTitle}>שלבי הכנה</Text>
          <Text style={styles.stepCounter}>שלב 3 מתוך 3</Text>
        </View>

        <ScrollLockContext.Provider value={setScrollLocked}>
          <ScrollView
            style={styles.flex}
            contentContainerStyle={[styles.content, { paddingBottom: tabBarClearance }]}
            keyboardShouldPersistTaps="handled"
            scrollEnabled={!scrollLocked}
          >
            <Animated.View entering={FadeInUp.delay(200)}>
              <FormSection icon="list-outline" title="שלבי הכנה">
                <StepEditor steps={steps} onChange={onStepsChange} />
              </FormSection>
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(300)}>
              <FormSection icon="image-outline" title="תמונה" optionalHint="אופציונלי">
                <RecipePhotoInput imageUri={photoUri} onImageSelected={onPhotoSelected} />
              </FormSection>
            </Animated.View>

            <Button title="שמור" onPress={onSave} loading={isSaving} style={styles.cta} />
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
