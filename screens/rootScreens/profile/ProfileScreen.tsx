import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { View, Text, Switch, StyleSheet, Alert } from "react-native";

import { signOut } from "firebase/auth";
import { RootState } from "../../../store/store";
import { setProfile } from "../../../store/userSlice";
import { useThemeColors } from "../../../theme/useThemeColors";
import { auth } from "../../../services/firebase/firebaseConfig";
import { updateUserProfile } from "../../../services/firebase/userService";

import Button from "../../../components/ui/Button";
import ProfileAvatar from "../../../components/profile/ProfileAvatar";
import { ThemeColors } from "../../../theme/colors";

export default function ProfileScreen() {
  const dispatch = useDispatch();
  const colors = useThemeColors();
  const styles = createStyles(colors);
  const profile = useSelector((state: RootState) => state.user.profile);

  const [darkModeState, setDarkModeState] = useState(
    profile?.darkMode || false
  );

  if (!profile) return <Text>Loading...</Text>;

  const handleDarkModeChange = async (value: boolean) => {
    setDarkModeState(value);

    dispatch(
      setProfile({
        ...profile,
        darkMode: value,
      })
    );

    await updateUserProfile(profile.uid, {
      darkMode: value,
    });
  };

  const handleLogout = () => {
    Alert.alert(
      "Log out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Log out",
          style: "destructive",
          onPress: async () => {
            await signOut(auth);
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <ProfileAvatar
        uid={profile.uid}
        avatarUrl={profile.avatarUrl || null}
        profile={profile}
      />

      <Text style={styles.name}>{profile.name}</Text>
      <Text style={styles.email}>{profile.email}</Text>

      <View style={styles.darkModeContainer}>
        <Text style={styles.darkModeText}>Dark Mode</Text>
        <Switch value={darkModeState} onValueChange={handleDarkModeChange} />
      </View>

      <Button
        title="Log out"
        onPress={handleLogout}
        style={styles.logoutButton}
      />
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: colors.background.default,
    },
    name: {
      fontSize: 22,
      fontWeight: "600",
      textAlign: "center",
      marginTop: 10,
      color: colors.text.primary,
    },
    email: {
      textAlign: "center",
      marginBottom: 30,
      color: colors.text.secondary,
    },
    darkModeContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 16,
      marginTop: 20,
      borderTopWidth: 1,
      borderTopColor: colors.border.default,
    },
    darkModeText: {
      fontSize: 16,
      color: colors.text.primary,
    },
    logoutButton: {
      marginTop: 30,
      width: 160,
      alignSelf: "center",
      backgroundColor: colors.danger[500],
    },
  });

