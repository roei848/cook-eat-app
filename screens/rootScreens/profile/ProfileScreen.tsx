import { useDispatch, useSelector } from "react-redux";
import { View, Text, StyleSheet, Alert } from "react-native";

import { RootState } from "../../../store/store";
import { ThemeColors } from "../../../theme/colors";
import { clearProfile, setProfile } from "../../../store/userSlice";
import { useThemeColors } from "../../../theme/useThemeColors";
import { updateUserProfile } from "../../../services/firebase/userService";
import { typography } from "../../../theme/typography";
import { SCREEN_PADDING_H, spacing } from "../../../theme/spacing";

import Screen from "../../Screen";
import Button from "../../../components/ui/Button";
import Loader from "../../../components/shared/Loader";
import ThemeToggle from "../../../components/profile/ThemeToggle";
import ProfileAvatar from "../../../components/profile/ProfileAvatar";
import { clearRecipes } from "../../../store/recipeSlice";
import { logout } from "../../../services/firebase/authService";

export default function ProfileScreen() {
  const dispatch = useDispatch();
  const colors = useThemeColors();
  const styles = createStyles(colors);
  const profile = useSelector((state: RootState) => state.user.profile);

  if (!profile) {
    return (
      <Screen>
        <View style={styles.loading}>
          <Loader size={140} />
        </View>
      </Screen>
    );
  }

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
      "התנתקות",
      "האם להתנתק מהחשבון?",
      [
        { text: "ביטול", style: "cancel" },
        {
          text: "התנתקות",
          style: "destructive",
          onPress: async () => {
            await logout();
            dispatch(clearRecipes());
            dispatch(clearProfile());
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <Screen>
      <View style={styles.container}>
        <ProfileAvatar
          uid={profile.uid}
          avatarUrl={profile.avatarUrl || null}
          profile={profile}
        />

        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.email}>{profile.email}</Text>

        <View style={styles.darkModeContainer}>
          <Text style={styles.darkModeText}>בחירת עיצוב</Text>
          <ThemeToggle
            value={profile.darkMode ? "dark" : "light"}
            onChange={handleThemeChange}
          />
        </View>

        <Button
          title="התנתקות"
          onPress={handleLogout}
          style={styles.logoutButton}
        />
      </View>
    </Screen>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: SCREEN_PADDING_H,
    },
    loading: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    name: {
      ...typography.displayM,
      textAlign: "center",
      marginTop: spacing.md,
      color: colors.text.primary,
    },
    email: {
      ...typography.bodySmall,
      textAlign: "center",
      marginBottom: spacing.xxl,
      color: colors.text.secondary,
    },
    darkModeContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: spacing.lg,
      marginTop: spacing.xl,
      borderTopWidth: 1,
      borderTopColor: colors.border.default,
    },
    darkModeText: {
      ...typography.body,
      fontSize: 16,
      color: colors.text.primary,
    },
    logoutButton: {
      marginTop: spacing.xxxl,
      width: 180,
      alignSelf: "center",
      backgroundColor: colors.danger[500],
    },
  });
