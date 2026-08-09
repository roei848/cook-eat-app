import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

import Screen from "../../Screen";
import { ThemeColors } from "../../../theme/colors";
import { useThemeColors } from "../../../theme/useThemeColors";
import { typography } from "../../../theme/typography";
import { radius, spacing, SCREEN_PADDING_H } from "../../../theme/spacing";
import Loader from "../../../components/shared/Loader";
import Button from "../../../components/ui/Button";
import ScalePressable from "../../../components/ui/ScalePressable";

interface ImageCaptureScreenProps {
  imageUri?: string;
  isLoading: boolean;
  errorMessage?: string;
  onRetry: () => void;
  onFillManually: () => void;
}

export default function ImageCaptureScreen({
  imageUri,
  isLoading,
  errorMessage,
  onRetry,
  onFillManually,
}: ImageCaptureScreenProps) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  return (
    <Screen>
      <View style={styles.container}>
        {imageUri ? (
          <Animated.View entering={FadeIn.duration(400)} style={styles.previewWrapper}>
            <Image source={{ uri: imageUri }} style={styles.preview} />
          </Animated.View>
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="camera-outline" size={48} color={colors.text.muted} />
          </View>
        )}

        {isLoading && (
          <View style={styles.loadingContainer}>
            <Loader size={180} text="מנתח מתכון עם AI..." />
          </View>
        )}

        {errorMessage && (
          <Animated.View entering={FadeInUp.delay(200)} style={styles.errorContainer}>
            <Text style={styles.errorText}>{errorMessage}</Text>
            <Button title="נסה שוב" onPress={onRetry} />
            <ScalePressable
              onPress={onFillManually}
              style={styles.secondaryButton}
              accessibilityRole="button"
            >
              <Text style={styles.secondaryButtonText}>מלא ידנית</Text>
            </ScalePressable>
          </Animated.View>
        )}
      </View>
    </Screen>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: SCREEN_PADDING_H,
      alignItems: "center",
      justifyContent: "center",
    },
    previewWrapper: {
      width: "100%",
      marginBottom: spacing.xxl,
    },
    preview: {
      width: "100%",
      height: 320,
      borderRadius: radius.lg,
    },
    placeholder: {
      width: "100%",
      height: 320,
      backgroundColor: colors.background.secondary,
      borderRadius: radius.lg,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: spacing.xxl,
    },
    loadingContainer: {
      alignItems: "center",
    },
    errorContainer: {
      alignItems: "center",
      gap: spacing.md,
      width: "100%",
    },
    errorText: {
      ...typography.body,
      color: colors.danger[500],
      textAlign: "center",
      marginBottom: spacing.sm,
    },
    secondaryButton: {
      width: "100%",
      paddingVertical: 14,
      borderRadius: radius.sm,
      backgroundColor: colors.background.secondary,
      alignItems: "center",
    },
    secondaryButtonText: {
      ...typography.button,
      color: colors.text.primary,
    },
  });
