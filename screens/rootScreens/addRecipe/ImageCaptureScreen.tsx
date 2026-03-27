import React from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Screen from "../../Screen";
import { ThemeColors } from "../../../theme/colors";
import { useThemeColors } from "../../../theme/useThemeColors";

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
          <Image source={{ uri: imageUri }} style={styles.preview} />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="camera-outline" size={48} color={colors.text.muted} />
          </View>
        )}

        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary[500]} />
            <Text style={styles.loadingText}>מנתח מתכון עם AI...</Text>
          </View>
        )}

        {errorMessage && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errorMessage}</Text>
            <TouchableOpacity style={styles.button} onPress={onRetry}>
              <Text style={styles.buttonText}>נסה שוב</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonSecondary]}
              onPress={onFillManually}
            >
              <Text style={styles.buttonTextSecondary}>מלא ידנית</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Screen>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 20,
      alignItems: "center",
      justifyContent: "center",
    },
    preview: {
      width: "100%",
      height: 320,
      borderRadius: 20,
      marginBottom: 24,
    },
    placeholder: {
      width: "100%",
      height: 320,
      backgroundColor: colors.background.secondary,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 24,
    },
    loadingContainer: {
      alignItems: "center",
      gap: 12,
    },
    loadingText: {
      fontSize: 16,
      color: colors.text.secondary,
    },
    errorContainer: {
      alignItems: "center",
      gap: 12,
      width: "100%",
    },
    errorText: {
      fontSize: 15,
      color: colors.danger[500],
      textAlign: "center",
      marginBottom: 8,
    },
    button: {
      width: "100%",
      paddingVertical: 14,
      borderRadius: 12,
      backgroundColor: colors.primary[500],
      alignItems: "center",
    },
    buttonText: {
      fontSize: 15,
      fontWeight: "700",
      color: "#fff",
    },
    buttonSecondary: {
      backgroundColor: colors.background.secondary,
    },
    buttonTextSecondary: {
      fontSize: 15,
      fontWeight: "600",
      color: colors.text.primary,
    },
  });
