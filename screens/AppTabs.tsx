import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { ThemeColors } from "../theme/colors";
import { useThemeColors } from "../theme/useThemeColors";

import HomeScreen from "../screens/rootScreens/HomeScreen";
import AddRecipeScreen from "../screens/rootScreens/AddRecipeScreen";
import GroceryListScreen from "../screens/rootScreens/GroceryListScreen";
import ProfileStack from "./rootScreens/profile/ProfileStack";
import SearchStack from "./rootScreens/search/SearchStack";

const Tab = createBottomTabNavigator();

type TabConfig = {
  name: string;
  component: React.ComponentType<any>;
  icon: keyof typeof Ionicons.glyphMap;
  iconOutline: keyof typeof Ionicons.glyphMap;
  isAction?: boolean;
};

export default function AppTabs() {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const tabs: TabConfig[] = [
    {
      name: "Home",
      component: HomeScreen,
      icon: "home",
      iconOutline: "home-outline",
    },
    {
      name: "Search",
      component: SearchStack,
      icon: "search",
      iconOutline: "search-outline",
    },
    {
      name: "AddRecipe",
      component: AddRecipeScreen,
      icon: "add",
      iconOutline: "add",
      isAction: true,
    },
    {
      name: "Grocery",
      component: GroceryListScreen,
      icon: "cart",
      iconOutline: "cart-outline",
    },
    {
      name: "Profile",
      component: ProfileStack,
      icon: "person",
      iconOutline: "person-outline",
    },
  ];

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.primary[500],
        tabBarInactiveTintColor: colors.text.muted,
        tabBarStyle: styles.tabBar,
      }}
    >
      {tabs.map((tab) => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          options={{
            tabBarIcon: ({ color, size, focused }) => {
              if (tab.isAction) {
                return (
                  <View style={styles.addButton}>
                    <Ionicons
                      name="add"
                      size={32}
                      color={colors.text.inverse}
                    />
                  </View>
                );
              }

              return (
                <Ionicons
                  name={focused ? tab.icon : tab.iconOutline}
                  size={size}
                  color={color}
                />
              );
            },
          }}
        />
      ))}
    </Tab.Navigator>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    tabBar: {
      backgroundColor: colors.background.default,
      borderTopColor: colors.border.default,
      height: 64,
      paddingBottom: 8,
    },
    addButton: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.primary[500],
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 24,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 6,
    },
  });
