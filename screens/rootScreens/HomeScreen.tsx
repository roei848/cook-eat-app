import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Button from "../../components/ui/Button";
import { logout } from "../../services/firebase/authService";

export default function HomeScreen() {
  const handleLogout = async () => {
    try {
      await logout(); 
      // RootNavigator will automatically redirect to AuthStack
    } catch (error: any) {
      console.log("Logout error:", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Screen</Text>

      <Button
        title="Logout"
        onPress={handleLogout}
        style={{ marginTop: 20, width: 150 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 20,
  },
});
