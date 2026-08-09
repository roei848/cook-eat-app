import React from "react";
import { View, Text, Image, Alert, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import Animated, { FadeIn } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

import { ThemeColors } from "../../../theme/colors";
import { useThemeColors } from "../../../theme/useThemeColors";
import { typography } from "../../../theme/typography";
import { radius, spacing } from "../../../theme/spacing";
import ScalePressable from "../../ui/ScalePressable";

interface RecipePhotoInputProps {
  imageUri?: string;
  onImageSelected: (uri: string) => void;
}

export default function RecipePhotoInput({
  imageUri,
  onImageSelected,
}: RecipePhotoInputProps) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  async function handlePress() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("גישה נדחתה", "יש לאשר גישה לגלריה בהגדרות המכשיר.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images' as ImagePicker.MediaType,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      onImageSelected(result.assets[0].uri);
    }
  }

  if (imageUri) {
    return (
      <ScalePressable
        onPress={handlePress}
        scaleTo={0.98}
        accessibilityRole="button"
        accessibilityLabel="החלפת תמונה"
      >
        <Animated.View entering={FadeIn.duration(400)} style={styles.previewWrapper}>
          <Image source={{ uri: imageUri }} style={styles.preview} />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.4)", "rgba(0,0,0,0.75)"]}
            locations={[0, 0.5, 1]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.scrim}
          />
          <View style={styles.changeChip}>
            <Ionicons name="camera-reverse-outline" size={14} color="#FFFFFF" />
            <Text style={styles.changeText}>החלפת תמונה</Text>
          </View>
        </Animated.View>
      </ScalePressable>
    );
  }

  return (
    <ScalePressable
      onPress={handlePress}
      scaleTo={0.98}
      style={styles.placeholder}
      accessibilityRole="button"
      accessibilityLabel="הוספת תמונה"
    >
      <Ionicons name="camera-outline" size={28} color={colors.text.muted} />
      <Text style={styles.placeholderText}>הוספת תמונה</Text>
    </ScalePressable>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    previewWrapper: {
      width: "100%",
      aspectRatio: 16 / 9,
      borderRadius: radius.md,
      overflow: "hidden",
    },
    preview: {
      width: "100%",
      height: "100%",
    },
    scrim: {
      position: "absolute",
      bottom: 0,
      start: 0,
      end: 0,
      height: "45%",
    },
    changeChip: {
      position: "absolute",
      bottom: spacing.sm,
      start: spacing.sm,
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      backgroundColor: "rgba(0,0,0,0.55)",
      borderRadius: radius.pill,
      paddingHorizontal: 12,
      paddingVertical: 6,
    },
    changeText: {
      ...typography.label,
      color: "#FFFFFF",
    },
    placeholder: {
      width: "100%",
      aspectRatio: 16 / 9,
      backgroundColor: colors.background.secondary,
      borderRadius: radius.md,
      borderWidth: 1.5,
      borderColor: colors.border.default,
      borderStyle: "dashed",
      justifyContent: "center",
      alignItems: "center",
      gap: spacing.sm,
    },
    placeholderText: {
      ...typography.title,
      color: colors.text.secondary,
    },
  });
