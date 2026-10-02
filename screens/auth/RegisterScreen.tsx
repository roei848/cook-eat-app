import { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { registerWithEmail } from "../../services/firebase/authService";
import Screen from "../Screen";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import FlatButton from "../../components/ui/FlatButton";
import { useThemeColors } from "../../theme/useThemeColors";
import { ThemeColors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { authErrorMessage } from "../../utils/authErrors";

// TODO: Remove any type
export default function RegisterScreen({ navigation }: { navigation: any }) {
  const colors = useThemeColors();
  const styles = createStyles(colors);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      Alert.alert("שגיאה", "יש למלא את כל השדות");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("שגיאה", "הסיסמאות אינן תואמות");
      return;
    }

    try {
      setLoading(true);
      await registerWithEmail(name.trim(), email.trim(), password.trim());
    } catch (error) {
      Alert.alert("ההרשמה נכשלה", authErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.title}>יצירת חשבון</Text>

        <Input
          label="שם"
          placeholder="איך קוראים לך?"
          autoComplete="name"
          textContentType="name"
          value={name}
          onChangeText={setName}
        />

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
          placeholder="לפחות 6 תווים"
          secureTextEntry
          autoComplete="new-password"
          textContentType="newPassword"
          value={password}
          onChangeText={setPassword}
        />

        <Input
          label="אימות סיסמה"
          placeholder="הסיסמה פעם נוספת"
          secureTextEntry
          autoComplete="new-password"
          textContentType="newPassword"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <Button title="הרשמה" onPress={handleRegister} loading={loading} />

        <FlatButton
          title="כבר יש לך חשבון? התחברות"
          onPress={() => navigation.navigate("Login")}
          disabled={loading}
          style={styles.loginLink}
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
    loginLink: {
      marginTop: 16,
    },
  });
