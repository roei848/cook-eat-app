import React from "react";
import { StyleSheet, Text, View } from "react-native";

import Screen from "../Screen";
import Button from "../../components/ui/Button";
import { logout } from "../../services/firebase/authService";
import { useThemeColors } from "../../theme/useThemeColors";

export default function HomeScreen() {
  const colors = useThemeColors();
  const handleLogout = async () => {
    try {
      await logout();
      // RootNavigator will automatically redirect to AuthStack
    } catch (error: any) {
      console.log("Logout error:", error.message);
    }
  };

  return (
    <Screen>
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.text.primary }]}>Home Screen</Text>

        <Button
          title="Logout"
          onPress={handleLogout}
          style={{ marginTop: 20, width: 150 }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 20,
  },
});
