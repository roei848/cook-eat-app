import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../HomeScreen";
import RecipeScreen from "../sharedScreens/RecipeScreen";
import EditRecipeScreenContainer from "../sharedScreens/EditRecipeScreenContainer";
import { SharedRecipeParams } from "../sharedScreens/sharedRecipeRoutes";
import { useThemeColors } from "../../../theme/useThemeColors";

export type HomeStackParamList = {
  HomeMain: undefined;
} & SharedRecipeParams;

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
        options={{
          headerTransparent: true,
          headerBlurEffect: "regular",
          headerTintColor: "#FFFFFF",
          headerShadowVisible: false,
          title: "",
        }}
      />
      <Stack.Screen
        name="EditRecipe"
        component={EditRecipeScreenContainer}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
