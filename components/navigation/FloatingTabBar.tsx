import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { useThemeColors } from "../../theme/useThemeColors";
import { ThemeColors } from "../../theme/colors";
import { radius } from "../../theme/spacing";
import { TAB_BAR_HEIGHT, useTabBarBottomOffset } from "../../theme/layout";
import ScalePressable from "../ui/ScalePressable";

type TabVisual = {
  filled: keyof typeof Ionicons.glyphMap;
  outline: keyof typeof Ionicons.glyphMap;
  label: string;
  isAction?: boolean;
};

const TAB_VISUALS: Record<string, TabVisual> = {
  Home: { filled: "home", outline: "home-outline", label: "בית" },
  SearchTab: { filled: "search", outline: "search-outline", label: "חיפוש" },
  AddRecipe: {
    filled: "add",
    outline: "add",
    label: "הוספת מתכון",
    isAction: true,
  },
  Grocery: { filled: "cart", outline: "cart-outline", label: "רשימת קניות" },
  Profile: { filled: "person", outline: "person-outline", label: "פרופיל" },
};

/**
 * Detached floating pill tab bar with the add-recipe FAB breaching its top
 * edge. Content scrolls underneath — screens pad their scrollables with
 * useTabBarClearance().
 */
export default function FloatingTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const colors = useThemeColors();
  const styles = createStyles(colors);
  const bottomOffset = useTabBarBottomOffset();

  return (
    <View style={[styles.container, { bottom: bottomOffset }]}>
      <View style={styles.pill}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const visual = TAB_VISUALS[route.name] ?? {
            filled: "ellipse",
            outline: "ellipse-outline",
            label: route.name,
          };

          const handlePress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
              Haptics.selectionAsync().catch(() => {});
            }
          };

          const handleLongPress = () => {
            navigation.emit({ type: "tabLongPress", target: route.key });
          };

          if (visual.isAction) {
            return (
              <View key={route.key} style={styles.slot}>
                {/* The lift lives on a wrapper: ScalePressable's animated
                    scale transform would otherwise override translateY. */}
                <View style={styles.fabLift}>
                  <ScalePressable
                    onPress={handlePress}
                    onLongPress={handleLongPress}
                    scaleTo={0.92}
                    accessibilityRole="button"
                    accessibilityLabel={visual.label}
                    style={styles.fab}
                  >
                    <Ionicons
                      name="add"
                      size={32}
                      color={colors.text.inverse}
                    />
                  </ScalePressable>
                </View>
              </View>
            );
          }

          return (
            <Pressable
              key={route.key}
              onPress={handlePress}
              onLongPress={handleLongPress}
              accessibilityRole="button"
              accessibilityState={{ selected: isFocused }}
              accessibilityLabel={
                descriptors[route.key].options.tabBarAccessibilityLabel ??
                visual.label
              }
              style={styles.slot}
            >
              <Ionicons
                name={isFocused ? visual.filled : visual.outline}
                size={24}
                color={isFocused ? colors.primary[500] : colors.text.muted}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      position: "absolute",
      start: 16,
      end: 16,
    },
    pill: {
      flexDirection: "row",
      alignItems: "center",
      height: TAB_BAR_HEIGHT,
      borderRadius: radius.pill,
      backgroundColor: colors.card.default,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 16,
      elevation: 12,
    },
    slot: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
    },
    fabLift: {
      transform: [{ translateY: -18 }],
    },
    fab: {
      width: 58,
      height: 58,
      borderRadius: 29,
      backgroundColor: colors.primary[500],
      alignItems: "center",
      justifyContent: "center",
      shadowColor: colors.primary[500],
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.45,
      shadowRadius: 8,
      elevation: 8,
    },
  });
