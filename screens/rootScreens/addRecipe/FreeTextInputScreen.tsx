import React from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Screen from "../../Screen";
import { ThemeColors } from "../../../theme/colors";
import { useThemeColors } from "../../../theme/useThemeColors";
import { typography } from "../../../theme/typography";
import { spacing, SCREEN_PADDING_H } from "../../../theme/spacing";
import { useTabBarClearance } from "../../../theme/layout";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import BackButton from "../../../components/ui/BackButton";
import Loader from "../../../components/shared/Loader";

interface FreeTextInputScreenProps {
  text: string;
  /** Hard cap on the input so what the user sees is exactly what the model gets. */
  maxLength: number;
  isLoading: boolean;
  errorMessage?: string;
  onTextChange: (text: string) => void;
  onAnalyze: () => void;
  onBack: () => void;
}

export default function FreeTextInputScreen({
  text,
  maxLength,
  isLoading,
  errorMessage,
  onTextChange,
  onAnalyze,
  onBack,
}: FreeTextInputScreenProps) {
  const colors = useThemeColors();
  const styles = createStyles(colors);
  const tabBarClearance = useTabBarClearance();
  const canAnalyze = text.trim().length > 0;

  return (
    <Screen>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.flex}
      >
        {/* Back sits alone in the top bar, not in a row with the CTA:
            ScalePressable applies `style` to its inner scaled view, so a
            Button given `flex: 1` inside a row collapses. */}
        <View style={styles.topBar}>
          <BackButton onPress={onBack} disabled={isLoading} />
        </View>

        {/* Scrolls because a full caption grows the text box well past one
            screen; the bottom padding lets the CTA clear the floating tab bar. */}
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[styles.container, { paddingBottom: tabBarClearance }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Ionicons name="clipboard-outline" size={40} color={colors.primary[500]} />
            <Text style={styles.title}>הדבק טקסט של מתכון</Text>
            <Text style={styles.subtitle}>
              העתק את התיאור מפוסט באינסטגרם, פייסבוק או מהודעה והדבק כאן
            </Text>
          </View>

          <Input
            value={text}
            onChangeText={onTextChange}
            error={errorMessage}
            placeholder="הדבק כאן את הטקסט המלא של המתכון..."
            multiline
            maxLength={maxLength}
            style={styles.textArea}
            editable={!isLoading}
          />

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Loader size={160} text="מנתח מתכון עם AI..." />
            </View>
          ) : (
            <Button
              title="נתח"
              onPress={onAnalyze}
              disabled={!canAnalyze}
              style={styles.cta}
            />
          )}
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
    textArea: {
      minHeight: 220,
      // Android anchors multiline text mid-box by default; iOS is already top.
      textAlignVertical: "top",
    },
    loadingContainer: {
      marginTop: spacing.lg,
      alignItems: "center",
    },
    cta: {
      marginTop: spacing.sm,
    },
  });
