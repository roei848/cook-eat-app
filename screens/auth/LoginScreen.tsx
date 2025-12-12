import { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { loginWithEmail } from "../../services/firebase/authService";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import FlatButton from "../../components/ui/FlatButton";

// TODO: Remove any type
export default function LoginScreen({ navigation }: { navigation: any }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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

      <Button title="Login" onPress={handleLogin} loading={loading} />

      <FlatButton
        title="Don't have an account? Register"
        onPress={() => navigation.navigate("Register")}
        style={{ marginTop: 16 }}
      />
      <FlatButton
        title="Forgot password?"
        onPress={() => navigation.navigate("ForgotPassword")}
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
