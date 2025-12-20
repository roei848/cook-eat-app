import { useState } from "react";
import {
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useDispatch } from "react-redux";

import { setProfile } from "../../store/userSlice";
import { uploadProfileImage } from "../../services/firebase/storageService";
import { updateUserProfile } from "../../services/firebase/userService";
import { UserProfile } from "../../types/user";

const defaultAvatar = require("../../assets/arthur.png");

interface Props {
  uid: string;
  avatarUrl: string | null;
  profile: UserProfile;
}

export default function ProfileAvatar({ uid, avatarUrl, profile }: Props) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  // -----------------------
  // Shared upload
  // -----------------------
  const handleAvatarUpload = async (uri: string) => {
    try {
      setLoading(true);

      const newAvatarUrl = await uploadProfileImage(uid, uri);
      
      console.log("newAvatarUrl", newAvatarUrl);

      dispatch(
        setProfile({
          ...profile,
          avatarUrl: newAvatarUrl,
        })
      );

      console.log("newAvatarUrl", newAvatarUrl);
      
      await updateUserProfile(uid, {
        avatarUrl: newAvatarUrl,
      });
    } catch (err) {
      console.log("Avatar upload error:", err);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------
  // Camera
  // -----------------------
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") return;

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      handleAvatarUpload(result.assets[0].uri);
    }
  };

  // -----------------------
  // Gallery
  // -----------------------
  const pickFromGallery = async () => {
    const { status } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      handleAvatarUpload(result.assets[0].uri);
    }
  };

  // -----------------------
  // Remove avatar
  // -----------------------
  const removeAvatar = async () => {
    try {
      setLoading(true);

      dispatch(
        setProfile({
          ...profile,
          avatarUrl: null,
        })
      );

      await updateUserProfile(uid, {
        avatarUrl: undefined,
      });
    } catch (err) {
      console.log("Remove avatar error:", err);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------
  // Options dialog
  // -----------------------
  const showAvatarOptions = () => {
    Alert.alert(
      "Change profile photo",
      "Choose an option",
      [
        { text: "Take Photo", onPress: takePhoto },
        { text: "Choose from Gallery", onPress: pickFromGallery },
        avatarUrl
          ? {
              text: "Remove Photo",
              style: "destructive",
              onPress: removeAvatar,
            }
          : null,
        { text: "Cancel", style: "cancel" },
      ].filter(Boolean) as any
    );
  };

  return (
    <TouchableOpacity onPress={showAvatarOptions} style={styles.container}>
      <Image
        source={avatarUrl ? { uri: avatarUrl } : defaultAvatar}
        style={styles.avatar}
      />
      {loading && <ActivityIndicator style={styles.loading} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  loading: {
    marginTop: 10,
  },
});
