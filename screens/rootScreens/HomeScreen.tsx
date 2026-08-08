import React from "react";
import { StyleSheet, Text, View, ScrollView, FlatList } from "react-native";
import { useSelector } from "react-redux";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";

import Screen from "../Screen";
import RecipeCardHorizontal from "../../components/recipe/RecipeCardHorizontal";
import CategoryBadge from "../../components/category/CategoryBadge";
import ScalePressable from "../../components/ui/ScalePressable";
import { useThemeColors } from "../../theme/useThemeColors";
import { ThemeColors } from "../../theme/colors";
import { RootState } from "../../store/store";
import { Category } from "../../types/enums/category";
import { HomeStackParamList } from "./home/HomeStack";
import { AppTabsParamList } from "../AppTabs";
import { typography } from "../../theme/typography";
import { SCREEN_PADDING_H, spacing } from "../../theme/spacing";
import { useTabBarClearance } from "../../theme/layout";

const ALL_CATEGORIES = Object.values(Category);

export default function HomeScreen({
  navigation,
}: NativeStackScreenProps<HomeStackParamList, "HomeMain">) {
  const colors = useThemeColors();
  const styles = createStyles(colors);
  const tabBarClearance = useTabBarClearance();
  const profile = useSelector((state: RootState) => state.user.profile);
  const recipeItems = useSelector((state: RootState) => state.recipes.items);

  const recentRecipes = recipeItems.slice(0, 10);

  const openCategory = (category: Category) => {
    navigation
      .getParent<BottomTabNavigationProp<AppTabsParamList>>()
      ?.navigate("SearchTab", {
        screen: "Category",
        params: { category },
        initial: false,
      });
  };

  return (
    <Screen>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: tabBarClearance },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>
            {profile?.name ? `שלום, ${profile.name} 👋` : "שלום!"}
          </Text>
          <Text style={styles.headline}>מה נבשל היום?</Text>
        </View>

        {/* Recent recipes horizontal scroll */}
        {recentRecipes.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>מתכונים אחרונים</Text>
            <FlatList
              data={recentRecipes}
              keyExtractor={(item) => item.id ?? item.title}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
              renderItem={({ item }) => (
                <RecipeCardHorizontal
                  recipe={item}
                  onPress={() =>
                    navigation.navigate("Recipe", { recipe: item })
                  }
                />
              )}
            />
          </View>
        )}

        {/* Category chips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>קטגוריות</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsContainer}
          >
            {ALL_CATEGORIES.map((category) => (
              <ScalePressable
                key={category}
                onPress={() => openCategory(category)}
                accessibilityRole="button"
                accessibilityLabel={`קטגוריית ${category}`}
              >
                <CategoryBadge category={category} size="md" />
              </ScalePressable>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </Screen>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    scroll: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: spacing.xxxl,
    },
    header: {
      paddingHorizontal: SCREEN_PADDING_H,
      paddingTop: spacing.lg,
      paddingBottom: spacing.xxl,
    },
    greeting: {
      ...typography.body,
      color: colors.text.secondary,
      marginBottom: spacing.xs,
    },
    headline: {
      ...typography.displayXL,
      color: colors.text.primary,
    },
    section: {
      marginBottom: 28,
    },
    sectionTitle: {
      ...typography.titleL,
      color: colors.text.primary,
      paddingHorizontal: SCREEN_PADDING_H,
      marginBottom: spacing.md + 2,
    },
    horizontalList: {
      paddingStart: SCREEN_PADDING_H,
    },
    chipsContainer: {
      paddingHorizontal: SCREEN_PADDING_H,
      gap: spacing.sm,
    },
  });
