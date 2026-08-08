import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeStack from "../screens/rootScreens/home/HomeStack";
import AddRecipeStack from "../screens/rootScreens/addRecipe/AddRecipeStack";
import GroceryListScreen from "../screens/rootScreens/GroceryListScreen";
import ProfileStack from "./rootScreens/profile/ProfileStack";
import SearchStack from "./rootScreens/search/SearchStack";
import FloatingTabBar from "../components/navigation/FloatingTabBar";

const Tab = createBottomTabNavigator();

export default function AppTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="SearchTab" component={SearchStack} />
      <Tab.Screen name="AddRecipe" component={AddRecipeStack} />
      <Tab.Screen name="Grocery" component={GroceryListScreen} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
}
