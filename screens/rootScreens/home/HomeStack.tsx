import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../HomeScreen";
import RecipeScreen from "../sharedScreens/RecipeScreen";
import { Recipe } from "../../../types/recipe";
import { useThemeColors } from "../../../theme/useThemeColors";

export type HomeStackParamList = {
  HomeMain: undefined;
  Recipe: { recipe: Recipe };
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStack() {
  const colors = useThemeColors();

  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: colors.header.text,
        headerStyle: { backgroundColor: colors.header.background },
        headerShadowVisible: true,
      }}
    >
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Recipe"
        component={RecipeScreen}
        options={({ route }) => ({ title: route.params.recipe.title })}
      />
    </Stack.Navigator>
  );
}
