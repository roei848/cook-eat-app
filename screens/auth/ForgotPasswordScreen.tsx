import { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import Screen from "../Screen";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import FlatButton from "../../components/ui/FlatButton";
import { resetPassword } from "../../services/firebase/authService";
import { useThemeColors } from "../../theme/useThemeColors";
import { ThemeColors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { authErrorMessage } from "../../utils/authErrors";

// TODO: Remove any type
export default function ForgotPasswordScreen({
  navigation,
}: {
  navigation: any;
}) {
  const colors = useThemeColors();
  const styles = createStyles(colors);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email.trim()) {
      Alert.alert("שגיאה", "יש להזין אימייל");
      return;
    }

    try {
      setLoading(true);
      await resetPassword(email);
      Alert.alert("בדוק את תיבת הדואר", "שלחנו לך קישור לאיפוס הסיסמה.", [
        { text: "אישור", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert("השליחה נכשלה", authErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.title}>איפוס סיסמה</Text>
        <Text style={styles.subtitle}>
          נשלח לך קישור לאיפוס הסיסמה לכתובת האימייל שלך
        </Text>

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
          returnKeyType="send"
          onSubmitEditing={handleResetPassword}
          value={email}
          onChangeText={setEmail}
        />

        <Button
          title="שליחת קישור לאיפוס"
          onPress={handleResetPassword}
          loading={loading}
        />

        <FlatButton
          title="חזרה להתחברות"
          onPress={() => navigation.goBack()}
          disabled={loading}
          style={styles.backLink}
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
      marginBottom: 8,
    },
    subtitle: {
      ...typography.body,
      color: colors.text.secondary,
      marginBottom: 30,
    },
    backLink: {
      marginTop: 16,
    },
  });
