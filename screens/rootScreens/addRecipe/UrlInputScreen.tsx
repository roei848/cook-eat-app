import React from "react";
import {
  View,
  Text,
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
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import BackButton from "../../../components/ui/BackButton";
import Loader from "../../../components/shared/Loader";

interface UrlInputScreenProps {
  url: string;
  isLoading: boolean;
  errorMessage?: string;
  onUrlChange: (url: string) => void;
  onAnalyze: () => void;
  onBack: () => void;
}

export default function UrlInputScreen({
  url,
  isLoading,
  errorMessage,
  onUrlChange,
  onAnalyze,
  onBack,
}: UrlInputScreenProps) {
  const colors = useThemeColors();
  const styles = createStyles(colors);
  const canAnalyze = url.trim().length > 0;

  return (
    <Screen>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.flex}
      >
        {/* Same top-bar back affordance as the wizard steps. Not a row with the
            CTA: ScalePressable applies `style` to its inner scaled view, so a
            Button given `flex: 1` inside a row collapses. */}
        <View style={styles.topBar}>
          <BackButton onPress={onBack} disabled={isLoading} />
        </View>

        <View style={styles.container}>
          <View style={styles.header}>
            <Ionicons name="link-outline" size={40} color={colors.primary[500]} />
            <Text style={styles.title}>הדבק קישור למתכון</Text>
            <Text style={styles.subtitle}>
              הכנס כתובת URL של מתכון מאתר בישול כלשהו
            </Text>
          </View>

          <Input
            value={url}
            onChangeText={onUrlChange}
            error={errorMessage}
            placeholder="https://www.example.com/recipe"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            returnKeyType="go"
            onSubmitEditing={canAnalyze ? onAnalyze : undefined}
            // URL content is Latin/LTR by nature — the one legitimate LTR input
            textAlign="left"
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
        </View>
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
      flex: 1,
      paddingHorizontal: SCREEN_PADDING_H,
      paddingTop: spacing.lg,
    },
    header: {
      alignItems: "center",
      marginBottom: spacing.xxxl,
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
    loadingContainer: {
      marginTop: spacing.lg,
      alignItems: "center",
    },
    cta: {
      marginTop: spacing.sm,
    },
  });
