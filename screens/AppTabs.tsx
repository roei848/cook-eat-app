import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigatorScreenParams } from "@react-navigation/native";

import HomeStack from "../screens/rootScreens/home/HomeStack";
import AddRecipeStack, {
  AddRecipeStackParamList,
} from "../screens/rootScreens/addRecipe/AddRecipeStack";
import GroceryListScreen from "../screens/rootScreens/GroceryListScreen";
import ProfileStack from "./rootScreens/profile/ProfileStack";
import SearchStack, {
  SearchStackParamList,
} from "./rootScreens/search/SearchStack";
import FloatingTabBar from "../components/navigation/FloatingTabBar";

export type AppTabsParamList = {
  Home: undefined;
  SearchTab: NavigatorScreenParams<SearchStackParamList>;
  // `| undefined` keeps plain `navigate("AddRecipe")` valid for the tab bar
  AddRecipe: NavigatorScreenParams<AddRecipeStackParamList> | undefined;
  Grocery: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<AppTabsParamList>();

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
