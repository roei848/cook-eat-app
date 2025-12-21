import React from "react";
import { StyleSheet, Text, View } from "react-native";

import Screen from "../Screen";
import Button from "../../components/ui/Button";
import { useThemeColors } from "../../theme/useThemeColors";
import { recipes } from "../../mocks/recipes";
import { createRecipe } from "../../services/firebase/recipeService";

export default function HomeScreen() {
  const colors = useThemeColors();
  

  const addDummyRecipe = async () => {
    console.log("Adding dummy recipes...");

    // for (const recipe of recipes) {
    //   const id = await createRecipe(recipe);
    //   console.log("Recipe added:", recipe.title, id);
    // }

    console.log("Recipes added:", recipes.length);
  };

  return (
    <Screen>
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.text.primary }]}>
          Home Screen
        </Text>

        <Button
          title="Add Dummy Recipe"
          onPress={addDummyRecipe}
          style={{ marginTop: 20, width: 200 }}
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
