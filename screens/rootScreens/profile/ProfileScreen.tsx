import { useDispatch, useSelector } from "react-redux";
import { View, Text, StyleSheet, Alert } from "react-native";

import { signOut } from "firebase/auth";
import { RootState } from "../../../store/store";
import { ThemeColors } from "../../../theme/colors";
import { setProfile } from "../../../store/userSlice";
import { useThemeColors } from "../../../theme/useThemeColors";
import { auth } from "../../../services/firebase/firebaseConfig";
import { updateUserProfile } from "../../../services/firebase/userService";

import Button from "../../../components/ui/Button";
import ThemeToggle from "../../../components/profile/ThemeToggle";
import ProfileAvatar from "../../../components/profile/ProfileAvatar";

export default function ProfileScreen() {
  const dispatch = useDispatch();
  const colors = useThemeColors();
  const styles = createStyles(colors);
  const profile = useSelector((state: RootState) => state.user.profile);

  if (!profile) return <Text>Loading...</Text>;

  const handleThemeChange = async (theme: "light" | "dark") => {
    const isDark = theme === "dark";

    dispatch(
      setProfile({
        ...profile,
        darkMode: isDark,
      })
    );

    await updateUserProfile(profile.uid, {
      darkMode: isDark,
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
        <ThemeToggle
          value={profile.darkMode ? "dark" : "light"}
          onChange={handleThemeChange}
        />
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
      paddingTop: 80,
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
