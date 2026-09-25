import { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { loginWithEmail, loginWithGoogle } from "../../services/firebase/authService";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import FlatButton from "../../components/ui/FlatButton";
import GoogleSignInButton from "../../components/auth/GoogleSignInButton";
import OrDivider from "../../components/auth/OrDivider";

// TODO: Remove any type
export default function LoginScreen({ navigation }: { navigation: any }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    try {
      setLoading(true);
      await loginWithEmail(email, password);
      // RootNavigator automatically redirects when user logs in
    } catch (error: any) {
      Alert.alert("Login Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      // Resolves null when the picker is dismissed — nothing to report then.
      await loginWithGoogle();
    } catch (error: any) {
      Alert.alert("Google Sign-In Failed", error.message);
    } finally {
      setGoogleLoading(false);
    }
  };

  const busy = loading || googleLoading;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back 👋</Text>
      <Input
        label="Email"
        placeholder="Enter your email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <Input
        label="Password"
        placeholder="Enter your password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button
        title="Login"
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
        title="Don't have an account? Register"
        onPress={() => navigation.navigate("Register")}
        disabled={busy}
        style={{ marginTop: 16 }}
      />
      <FlatButton
        title="Forgot password?"
        onPress={() => navigation.navigate("ForgotPassword")}
        disabled={busy}
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
  divider: {
    marginVertical: 20,
  },
});
