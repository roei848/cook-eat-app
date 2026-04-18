import React from "react";
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Screen from "../../Screen";
import { ThemeColors } from "../../../theme/colors";
import { useThemeColors } from "../../../theme/useThemeColors";
import Button from "../../../components/ui/Button";
import FlatButton from "../../../components/ui/FlatButton";
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

  return (
    <Screen>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.flex}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Ionicons name="link-outline" size={40} color={colors.primary[500]} />
            <Text style={styles.title}>הדבק קישור למתכון</Text>
            <Text style={styles.subtitle}>
              הכנס כתובת URL של מתכון מאתר בישול כלשהו
            </Text>
          </View>

          <TextInput
            style={[styles.input, errorMessage ? styles.inputError : null]}
            value={url}
            onChangeText={onUrlChange}
            placeholder="https://www.example.com/recipe"
            placeholderTextColor={colors.text.muted}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            textAlign="left"
            editable={!isLoading}
          />

          {errorMessage && (
            <Text style={styles.errorText}>{errorMessage}</Text>
          )}

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Loader size={160} text="מנתח מתכון עם AI..." />
            </View>
          ) : (
            <View style={styles.actions}>
              <FlatButton title="‹ חזור" onPress={onBack} />
              <Button
                title="נתח"
                onPress={onAnalyze}
                disabled={!url.trim()}
                style={styles.analyzeButton}
              />
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    flex: { flex: 1 },
    container: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 24,
    },
    header: {
      alignItems: "center",
      marginBottom: 32,
      gap: 8,
    },
    title: {
      fontSize: 22,
      fontWeight: "700",
      color: colors.text.primary,
      textAlign: "center",
    },
    subtitle: {
      fontSize: 14,
      color: colors.text.secondary,
      textAlign: "center",
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
      marginBottom: 8,
    },
    inputError: {
      borderColor: colors.danger[500],
    },
    errorText: {
      fontSize: 13,
      color: colors.danger[500],
      marginBottom: 16,
    },
    loadingContainer: {
      marginTop: 16,
      alignItems: "center",
    },
    actions: {
      flexDirection: "row",
      gap: 12,
      marginTop: 16,
      alignItems: "center",
    },
    analyzeButton: {
      flex: 1,
    },
  });
