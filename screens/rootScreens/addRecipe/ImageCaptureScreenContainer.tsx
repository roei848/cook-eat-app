import React, { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as ImagePicker from "expo-image-picker";

import { AddRecipeStackParamList } from "./AddRecipeStack";
import { analyzeRecipeImage } from "../../../services/gemini/geminiService";
import { uploadHandwrittenRecipeImage } from "../../../services/firebase/storageService";
import ImageCaptureScreen from "./ImageCaptureScreen";

type Nav = NativeStackNavigationProp<AddRecipeStackParamList>;

export default function ImageCaptureScreenContainer() {
  const navigation = useNavigation<Nav>();

  const [imageUri, setImageUri] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const showActionSheet = useCallback(() => {
    Alert.alert("הוסף תמונת מתכון", "", [
      { text: "צלם תמונה", onPress: launchCamera },
      { text: "בחר מגלריה", onPress: launchGallery },
      { text: "ביטול", style: "cancel", onPress: () => navigation.goBack() },
    ]);
  }, [navigation]);

  useEffect(() => {
    showActionSheet();
  }, [showActionSheet]);

  async function launchCamera() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("גישה נדחתה", "יש לאשר גישה למצלמה בהגדרות המכשיר.");
      navigation.goBack();
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: 'images' as ImagePicker.MediaType,
      quality: 0.8,
      base64: true,
    });
    if (result.canceled) {
      navigation.goBack();
      return;
    }
    await processImage(result.assets[0]);
  }

  async function launchGallery() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("גישה נדחתה", "יש לאשר גישה לגלריה בהגדרות המכשיר.");
      navigation.goBack();
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images' as ImagePicker.MediaType,
      quality: 0.8,
      base64: true,
    });
    if (result.canceled) {
      navigation.goBack();
      return;
    }
    await processImage(result.assets[0]);
  }

  async function processImage(asset: ImagePicker.ImagePickerAsset) {
    if (!asset.base64) {
      setErrorMessage("לא ניתן לקרוא את התמונה");
      return;
    }

    setImageUri(asset.uri);
    setIsLoading(true);
    setErrorMessage(undefined);

    try {
      const [partialRecipe, handwrittenRecipeImg] = await Promise.all([
        analyzeRecipeImage(asset.base64),
        uploadHandwrittenRecipeImage(asset.uri),
      ]);

      navigation.replace("RecipeReview", { partialRecipe, handwrittenRecipeImg });
    } catch (error) {
      setIsLoading(false);
      setErrorMessage("לא הצלחנו לקרוא את המתכון, נסה שוב");
    }
  }

  function handleRetry() {
    setErrorMessage(undefined);
    setImageUri(undefined);
    showActionSheet();
  }

  function handleFillManually() {
    navigation.replace("ManualWizardStep1");
  }

  return (
    <ImageCaptureScreen
      imageUri={imageUri}
      isLoading={isLoading}
      errorMessage={errorMessage}
      onRetry={handleRetry}
      onFillManually={handleFillManually}
    />
  );
}
