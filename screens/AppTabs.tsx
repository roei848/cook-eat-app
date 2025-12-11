import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeScreen from "../screens/rootScreens/HomeScreen";
import SearchScreen from "../screens/rootScreens/SearchScreen";
import AddRecipeScreen from "../screens/rootScreens/AddRecipeScreen";
import GroceryListScreen from "../screens/rootScreens/GroceryListScreen";
import ProfileScreen from "../screens/rootScreens/ProfileScreen";

const Tab = createBottomTabNavigator();

export default function AppTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="AddRecipe" component={AddRecipeScreen} />
      <Tab.Screen name="Grocery" component={GroceryListScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
