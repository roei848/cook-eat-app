import { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import FlatButton from "../../components/ui/FlatButton";
import { resetPassword } from "../../services/firebase/authService";

// TODO: Remove any type
export default function ForgotPasswordScreen({
  navigation,
}: {
  navigation: any;
}) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email");
      return;
    }

    try {
      setLoading(true);
      try {
        await resetPassword(email);
        Alert.alert("Sent successfully");
      } catch (err: any) {
        Alert.alert("Error", err.message);
        console.log(err);
      }

      Alert.alert(
        "Check your inbox",
        "We sent you a link to reset your password."
      );
      navigation.goBack();
    } catch (error: any) {
      Alert.alert("Reset Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>

      <Input
        label="Email"
        placeholder="Enter your email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <Button
        title="Send Reset Email"
        onPress={handleResetPassword}
        loading={loading}
      />

      <FlatButton
        title="Back to Login"
        onPress={() => navigation.goBack()}
        style={{ marginTop: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 30,
  },
});
