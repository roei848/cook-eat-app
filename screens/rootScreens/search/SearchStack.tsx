import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SearchScreen from "./SearchScreen";
import CategoryScreen from "./CategoryScreen";
import { Recipe } from "../../../types/recipe";
import { Category } from "../../../types/enums/category";
import { useThemeColors } from "../../../theme/useThemeColors";

export type SearchStackParamList = {
  Search: undefined;
  Category: { category: Category; recipes: Recipe[] };
};

const Stack = createNativeStackNavigator<SearchStackParamList>();

export default function SearchStack() {
  const colors = useThemeColors();

  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: colors.header.text,
        headerShadowVisible: true,
        headerStyle: {
          backgroundColor: colors.header.background,
        },
      }}
    >
      <Stack.Screen
        name="Search"
        component={SearchScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Category"
        component={CategoryScreen}
        options={({ route }) => ({
          title: route.params.category,
        })}
      />
    </Stack.Navigator>
  );
}
