import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

import { ThemeColors } from "../../../theme/colors";
import { useThemeColors } from "../../../theme/useThemeColors";

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
      <TouchableOpacity onPress={handlePress}>
        <Image source={{ uri: imageUri }} style={styles.preview} />
        <View style={styles.changeOverlay}>
          <Text style={styles.changeText}>שנה תמונה</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.placeholder} onPress={handlePress}>
      <Ionicons name="camera-outline" size={28} color={colors.text.muted} />
      <Text style={styles.placeholderText}>הוסף תמונה</Text>
    </TouchableOpacity>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    preview: {
      width: "100%",
      height: 180,
      borderRadius: 16,
    },
    changeOverlay: {
      position: "absolute",
      bottom: 8,
      right: 8,
      backgroundColor: "rgba(0,0,0,0.55)",
      borderRadius: 8,
      paddingHorizontal: 10,
      paddingVertical: 4,
    },
    changeText: {
      color: "#fff",
      fontSize: 13,
    },
    placeholder: {
      width: "100%",
      height: 140,
      backgroundColor: colors.background.secondary,
      borderRadius: 16,
      borderWidth: 1.5,
      borderColor: colors.border.default,
      borderStyle: "dashed",
      justifyContent: "center",
      alignItems: "center",
      gap: 8,
    },
    placeholderText: {
      fontSize: 14,
      color: colors.text.muted,
    },
  });
