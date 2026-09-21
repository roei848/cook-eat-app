import React from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

import Screen from "../../Screen";
import { ThemeColors } from "../../../theme/colors";
import { useThemeColors } from "../../../theme/useThemeColors";
import { typography } from "../../../theme/typography";
import { radius, spacing, SCREEN_PADDING_H } from "../../../theme/spacing";
import { useTabBarClearance } from "../../../theme/layout";
import { AiIdeasMode, MAX_WISH_CHARS } from "../../../types/aiIdeas";
import { Category } from "../../../types/enums/category";
import { Relative } from "../../../types/enums/relatives";
import { AiIdeasInputError } from "../../../utils/aiRecipeIdeas";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import BackButton from "../../../components/ui/BackButton";
import ScalePressable from "../../../components/ui/ScalePressable";
import IngredientChipsInput from "../../../components/ai/IngredientChipsInput";
import CategoryPicker from "../../../components/recipe/form/CategoryPicker";
import RelativesPicker from "../../../components/recipe/form/RelativesPicker";
import TimeInput from "../../../components/recipe/form/TimeInput";

interface AiIdeasInputScreenProps {
  mode: AiIdeasMode;
  ingredients: string[];
  suggestions: string[];
  wish: string;
  category?: Category;
  relatives: Relative[];
  maxTimeText: string;
  constraintsOpen: boolean;
  error?: AiIdeasInputError;
  onModeChange: (mode: AiIdeasMode) => void;
  onAddIngredient: (name: string) => void;
  onRemoveIngredient: (name: string) => void;
  onWishChange: (text: string) => void;
  onToggleCategory: (category: Category) => void;
  onRelativesChange: (relatives: Relative[]) => void;
  onMaxTimeChange: (text: string) => void;
  onToggleConstraints: () => void;
  onSubmit: () => void;
  onBack: () => void;
}

const MODES: { value: AiIdeasMode; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { value: "fridge", label: "מה יש לי במקרר", icon: "basket-outline" },
  { value: "wish", label: "מה בא לי לבשל", icon: "bulb-outline" },
];

export default function AiIdeasInputScreen({
  mode,
  ingredients,
  suggestions,
  wish,
  category,
  relatives,
  maxTimeText,
  constraintsOpen,
  error,
  onModeChange,
  onAddIngredient,
  onRemoveIngredient,
  onWishChange,
  onToggleCategory,
  onRelativesChange,
  onMaxTimeChange,
  onToggleConstraints,
  onSubmit,
  onBack,
}: AiIdeasInputScreenProps) {
  const colors = useThemeColors();
  const styles = createStyles(colors);
  const tabBarClearance = useTabBarClearance();

  // Disabled only while empty — the real thresholds are reported on press,
  // same as the free-text screen.
  const canSubmit =
    mode === "fridge" ? ingredients.length > 0 : wish.trim().length > 0;

  const constraintsSummary = [
    category,
    relatives.length > 0 ? relatives.join(", ") : null,
    maxTimeText.trim() ? `עד ${maxTimeText.trim()} דק׳` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  const errorFor = (field: AiIdeasInputError["field"]) =>
    error?.field === field ? error.message : undefined;

  return (
    <Screen>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.flex}
      >
        <View style={styles.topBar}>
          <BackButton onPress={onBack} />
        </View>

        <ScrollView
          style={styles.flex}
          contentContainerStyle={[styles.container, { paddingBottom: tabBarClearance }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Ionicons name="sparkles-outline" size={40} color={colors.primary[500]} />
            <Text style={styles.title}>מה נבשל היום?</Text>
            <Text style={styles.subtitle}>
              ספר מה יש במקרר או מה בא לך, ונציע 3 מתכונים
            </Text>
          </View>

          <View style={styles.modeTrack} accessibilityRole="tablist">
            {MODES.map((item) => {
              const selected = item.value === mode;
              return (
                <ScalePressable
                  key={item.value}
                  onPress={() => onModeChange(item.value)}
                  scaleTo={0.97}
                  style={[styles.modeSegment, selected && styles.modeSegmentSelected]}
                  accessibilityRole="tab"
                  accessibilityState={{ selected }}
                >
                  <Ionicons
                    name={item.icon}
                    size={16}
                    color={selected ? colors.primary[500] : colors.text.muted}
                  />
                  <Text
                    style={[styles.modeLabel, selected && styles.modeLabelSelected]}
                    numberOfLines={1}
                  >
                    {item.label}
                  </Text>
                </ScalePressable>
              );
            })}
          </View>

          {mode === "fridge" ? (
            <IngredientChipsInput
              value={ingredients}
              suggestions={suggestions}
              error={errorFor("ingredients")}
              onAdd={onAddIngredient}
              onRemove={onRemoveIngredient}
            />
          ) : (
            <Input
              label="מה בא לך?"
              value={wish}
              onChangeText={onWishChange}
              error={errorFor("wish")}
              placeholder="למשל: משהו חם ומנחם עם עוף, בלי הרבה עבודה"
              multiline
              maxLength={MAX_WISH_CHARS}
              style={styles.textArea}
            />
          )}

          <ScalePressable
            onPress={onToggleConstraints}
            scaleTo={0.98}
            style={styles.disclosure}
            accessibilityRole="button"
            accessibilityState={{ expanded: constraintsOpen }}
          >
            <Ionicons name="options-outline" size={20} color={colors.text.secondary} />
            <View style={styles.disclosureText}>
              <Text style={styles.disclosureTitle}>אפשרויות נוספות</Text>
              <Text style={styles.disclosureHint} numberOfLines={1}>
                {constraintsSummary || "קטגוריה, תזונה, זמן — אופציונלי"}
              </Text>
            </View>
            <Ionicons
              name={constraintsOpen ? "chevron-up" : "chevron-down"}
              size={20}
              color={colors.text.muted}
            />
          </ScalePressable>

          {constraintsOpen && (
            <Animated.View
              entering={FadeInDown.springify().damping(18)}
              style={styles.constraints}
            >
              <CategoryPicker
                label="קטגוריה"
                value={category}
                onChange={onToggleCategory}
              />
              <RelativesPicker value={relatives} onChange={onRelativesChange} />
              <TimeInput
                label="זמן הכנה מקסימלי"
                value={maxTimeText}
                onChange={onMaxTimeChange}
                error={errorFor("maxTime")}
              />
            </Animated.View>
          )}

          <Button
            title="הצע לי מתכונים"
            onPress={onSubmit}
            disabled={!canSubmit}
            style={styles.cta}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    flex: { flex: 1 },
    topBar: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: SCREEN_PADDING_H,
      marginBottom: spacing.lg,
    },
    container: {
      paddingHorizontal: SCREEN_PADDING_H,
      paddingTop: spacing.lg,
    },
    header: {
      alignItems: "center",
      marginBottom: spacing.xl,
      gap: spacing.sm,
    },
    title: {
      ...typography.displayM,
      color: colors.text.primary,
      textAlign: "center",
    },
    subtitle: {
      ...typography.body,
      color: colors.text.secondary,
      textAlign: "center",
    },
    modeTrack: {
      // Fit-content and centered, not a full-width bar
      alignSelf: "center",
      flexDirection: "row",
      backgroundColor: colors.background.secondary,
      borderRadius: radius.pill,
      padding: 4,
      marginBottom: spacing.xl,
    },
    modeSegment: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      paddingVertical: 10,
      paddingHorizontal: spacing.lg,
      borderRadius: radius.pill,
    },
    modeSegmentSelected: {
      backgroundColor: colors.card.default,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    },
    modeLabel: {
      ...typography.label,
      color: colors.text.secondary,
    },
    modeLabelSelected: {
      color: colors.primary[500],
    },
    textArea: {
      minHeight: 120,
      // Android anchors multiline text mid-box by default; iOS is already top.
      textAlignVertical: "top",
    },
    disclosure: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderRadius: radius.md,
      backgroundColor: colors.card.default,
      borderWidth: 1.5,
      borderColor: colors.border.default,
      marginBottom: spacing.lg,
    },
    disclosureText: {
      flex: 1,
    },
    disclosureTitle: {
      ...typography.title,
      color: colors.text.primary,
    },
    disclosureHint: {
      ...typography.caption,
      color: colors.text.muted,
      marginTop: 2,
    },
    constraints: {
      marginBottom: spacing.sm,
    },
    cta: {
      marginTop: spacing.sm,
    },
  });
