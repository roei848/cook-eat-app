import { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { loginWithEmail, loginWithGoogle } from "../../services/firebase/authService";
import Screen from "../Screen";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import FlatButton from "../../components/ui/FlatButton";
import GoogleSignInButton from "../../components/auth/GoogleSignInButton";
import OrDivider from "../../components/auth/OrDivider";
import { useThemeColors } from "../../theme/useThemeColors";
import { ThemeColors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { authErrorMessage } from "../../utils/authErrors";

// TODO: Remove any type
export default function LoginScreen({ navigation }: { navigation: any }) {
  const colors = useThemeColors();
  const styles = createStyles(colors);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert("שגיאה", "יש להזין אימייל וסיסמה");
      return;
    }

    try {
      setLoading(true);
      await loginWithEmail(email, password);
      // RootNavigator automatically redirects when user logs in
    } catch (error) {
      Alert.alert("ההתחברות נכשלה", authErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      // Resolves null when the picker is dismissed — nothing to report then.
      await loginWithGoogle();
    } catch (error) {
      Alert.alert("ההתחברות עם Google נכשלה", authErrorMessage(error));
    } finally {
      setGoogleLoading(false);
    }
  };

  const busy = loading || googleLoading;

  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.title}>ברוכים השבים 👋</Text>
        <Input
          label="אימייל"
          placeholder="name@example.com"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          autoComplete="email"
          textContentType="emailAddress"
          // Email addresses are Latin/LTR — same treatment as the URL field
          textAlign="left"
          value={email}
          onChangeText={setEmail}
        />
        <Input
          label="סיסמה"
          placeholder="הזן סיסמה"
          secureTextEntry
          autoComplete="current-password"
          textContentType="password"
          value={password}
          onChangeText={setPassword}
        />

        <Button
          title="התחברות"
          onPress={handleLogin}
          loading={loading}
          disabled={googleLoading}
        />

        <OrDivider style={styles.divider} />

        <GoogleSignInButton
          onPress={handleGoogleLogin}
          loading={googleLoading}
          disabled={loading}
        />

        <FlatButton
          title="אין לך חשבון? הרשמה"
          onPress={() => navigation.navigate("Register")}
          disabled={busy}
          style={styles.registerLink}
        />
        <FlatButton
          title="שכחת סיסמה?"
          onPress={() => navigation.navigate("ForgotPassword")}
          disabled={busy}
        />
      </View>
    </Screen>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      justifyContent: "center",
    },
    title: {
      ...typography.displayL,
      color: colors.text.primary,
      marginBottom: 30,
    },
    divider: {
      marginVertical: 20,
    },
    registerLink: {
      marginTop: 16,
    },
  });
