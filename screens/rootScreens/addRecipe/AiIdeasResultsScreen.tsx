import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

import Screen from "../../Screen";
import { ThemeColors } from "../../../theme/colors";
import { useThemeColors } from "../../../theme/useThemeColors";
import { typography } from "../../../theme/typography";
import { radius, spacing, SCREEN_PADDING_H } from "../../../theme/spacing";
import { useTabBarClearance } from "../../../theme/layout";
import { AiRecipeOption, AiRecipeRequest } from "../../../types/aiIdeas";
import { summarizeAiRequest } from "../../../utils/aiRecipeIdeas";
import Loader from "../../../components/shared/Loader";
import Button from "../../../components/ui/Button";
import FlatButton from "../../../components/ui/FlatButton";
import BackButton from "../../../components/ui/BackButton";
import ScalePressable from "../../../components/ui/ScalePressable";
import AiRecipeOptionCard from "../../../components/ai/AiRecipeOptionCard";

export type ResultsState =
  | { status: "loading" }
  | { status: "ready"; options: AiRecipeOption[] }
  | { status: "error"; message: string };

interface AiIdeasResultsScreenProps {
  request?: AiRecipeRequest;
  state: ResultsState;
  savedIds: string[];
  onSelect: (option: AiRecipeOption) => void;
  onRegenerate: () => void;
  onEditRequest: () => void;
  onDone: () => void;
  onBack: () => void;
}

export default function AiIdeasResultsScreen({
  request,
  state,
  savedIds,
  onSelect,
  onRegenerate,
  onEditRequest,
  onDone,
  onBack,
}: AiIdeasResultsScreenProps) {
  const colors = useThemeColors();
  const styles = createStyles(colors);
  const tabBarClearance = useTabBarClearance();

  return (
    <Screen>
      {/* Back stays enabled while loading — the container aborts the request */}
      <View style={styles.topBar}>
        <BackButton onPress={onBack} />
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={[styles.container, { paddingBottom: tabBarClearance }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>הרעיונות שלך</Text>
          {request && (
            <Text style={styles.summary} numberOfLines={2}>
              {summarizeAiRequest(request)}
            </Text>
          )}
        </View>

        {state.status === "loading" && (
          <View style={styles.loadingContainer}>
            <Loader size={180} text="מבשלים רעיונות... זה לוקח כ-20 שניות" />
          </View>
        )}

        {state.status === "error" && (
          <Animated.View entering={FadeInUp.delay(200)} style={styles.errorContainer}>
            <View style={styles.errorIconCircle}>
              <Ionicons name="cloud-offline-outline" size={34} color={colors.text.muted} />
            </View>
            <Text style={styles.errorText}>{state.message}</Text>
            <Button title="נסה שוב" onPress={onRegenerate} />
            <ScalePressable
              onPress={onEditRequest}
              style={styles.secondaryButton}
              accessibilityRole="button"
            >
              <Text style={styles.secondaryButtonText}>שנה את הבקשה</Text>
            </ScalePressable>
          </Animated.View>
        )}

        {state.status === "ready" && (
          <>
            <View style={styles.cards}>
              {state.options.map((option, index) => (
                <AiRecipeOptionCard
                  key={option.id}
                  option={option}
                  mode={request?.mode ?? "wish"}
                  index={index}
                  isSaved={savedIds.includes(option.id)}
                  onPress={() => onSelect(option)}
                />
              ))}
            </View>

            <Text style={styles.hint}>
              לחץ על רעיון כדי לראות את המתכון המלא, לערוך ולשמור
            </Text>

            <ScalePressable
              onPress={onRegenerate}
              style={styles.secondaryButton}
              accessibilityRole="button"
            >
              <Ionicons name="refresh-outline" size={18} color={colors.text.primary} />
              <Text style={styles.secondaryButtonText}>הצעות אחרות</Text>
            </ScalePressable>

            {savedIds.length > 0 && (
              <FlatButton title="סיום" onPress={onDone} style={styles.done} />
            )}
          </>
        )}
      </ScrollView>
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
      paddingTop: spacing.sm,
    },
    header: {
      marginBottom: spacing.xl,
      gap: spacing.xs,
    },
    title: {
      ...typography.displayL,
      color: colors.text.primary,
    },
    summary: {
      ...typography.body,
      color: colors.text.secondary,
    },
    loadingContainer: {
      alignItems: "center",
      paddingVertical: spacing.xxxl,
    },
    errorContainer: {
      alignItems: "center",
      gap: spacing.md,
      paddingTop: spacing.xxl,
    },
    errorIconCircle: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: colors.background.secondary,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: spacing.xs,
    },
    errorText: {
      ...typography.body,
      color: colors.text.secondary,
      textAlign: "center",
      marginBottom: spacing.sm,
    },
    cards: {
      gap: spacing.lg,
    },
    hint: {
      ...typography.caption,
      color: colors.text.muted,
      textAlign: "center",
      marginTop: spacing.lg,
      marginBottom: spacing.md,
    },
    secondaryButton: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: spacing.sm,
      paddingVertical: 14,
      borderRadius: radius.sm,
      backgroundColor: colors.background.secondary,
    },
    secondaryButtonText: {
      ...typography.button,
      color: colors.text.primary,
    },
    done: {
      alignSelf: "center",
      marginTop: spacing.md,
    },
  });
