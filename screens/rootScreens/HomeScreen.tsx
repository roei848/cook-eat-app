import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import Animated, { FadeInDown } from "react-native-reanimated";

import Screen from "../Screen";
import CategoryBadge from "../../components/category/CategoryBadge";
import ScalePressable from "../../components/ui/ScalePressable";
import Loader from "../../components/shared/Loader";
import HomeMasthead from "../../components/home/HomeMasthead";
import HomeEmptyState from "../../components/home/HomeEmptyState";
import SectionHeader from "../../components/home/SectionHeader";
import DailyHeroCard from "../../components/home/DailyHeroCard";
import RecipeRail from "../../components/home/RecipeRail";
import { RootState } from "../../store/store";
import {
  selectDailyHero,
  selectFamilySpotlight,
  selectFavoriteRecipes,
  selectQuickPicks,
  selectRecentRecipes,
} from "../../store/selectors/homeSelectors";
import { useHomeClock } from "../../hooks/useHomeClock";
import { Recipe } from "../../types/recipe";
import { Category } from "../../types/enums/category";
import { HomeStackParamList } from "./home/HomeStack";
import { AppTabsParamList } from "../AppTabs";
import { SCREEN_PADDING_H, spacing } from "../../theme/spacing";
import { useTabBarClearance } from "../../theme/layout";

const ALL_CATEGORIES = Object.values(Category);

type HomeSection = { key: string; node: React.ReactNode };

export default function HomeScreen({
  navigation,
}: NativeStackScreenProps<HomeStackParamList, "HomeMain">) {
  const tabBarClearance = useTabBarClearance();
  const { now, dateKey } = useHomeClock();

  const profile = useSelector((state: RootState) => state.user.profile);
  const subscribed = useSelector(
    (state: RootState) => state.recipes.subscribed
  );
  const recipeCount = useSelector(
    (state: RootState) => state.recipes.items.length
  );
  const hero = useSelector((state: RootState) =>
    selectDailyHero(state, dateKey)
  );
  const quickPicks = useSelector((state: RootState) =>
    selectQuickPicks(state, dateKey)
  );
  const favorites = useSelector(selectFavoriteRecipes);
  const spotlight = useSelector((state: RootState) =>
    selectFamilySpotlight(state, dateKey)
  );
  const recent = useSelector((state: RootState) =>
    selectRecentRecipes(state, dateKey)
  );

  const openRecipe = (recipe: Recipe) =>
    navigation.navigate("Recipe", { recipeId: recipe.id! });

  const openCategory = (category: Category) => {
    navigation
      .getParent<BottomTabNavigationProp<AppTabsParamList>>()
      ?.navigate("SearchTab", {
        screen: "Category",
        params: { category },
        initial: false,
      });
  };

  const openAddRecipe = () => {
    navigation
      .getParent<BottomTabNavigationProp<AppTabsParamList>>()
      ?.navigate("AddRecipe");
  };

  if (!subscribed) {
    return (
      <Screen>
        <View style={styles.centered}>
          <Loader size={140} />
        </View>
      </Screen>
    );
  }

  if (recipeCount === 0) {
    return (
      <Screen>
        <HomeMasthead userName={profile?.name} now={now} />
        <HomeEmptyState onAddRecipe={openAddRecipe} />
      </Screen>
    );
  }

  // Visible sections only — hidden ones must not leave stagger gaps.
  const sections: HomeSection[] = [
    {
      key: "masthead",
      node: <HomeMasthead userName={profile?.name} now={now} />,
    },
    hero && {
      key: "hero",
      node: (
        <>
          <SectionHeader title="המתכון של היום" />
          <DailyHeroCard recipe={hero} onPress={() => openRecipe(hero)} />
        </>
      ),
    },
    quickPicks.length > 0 && {
      key: "quickPicks",
      node: (
        <>
          <SectionHeader title="מהיר על השולחן" />
          <RecipeRail recipes={quickPicks} onPressRecipe={openRecipe} />
        </>
      ),
    },
    favorites.length > 0 && {
      key: "favorites",
      node: (
        <>
          <SectionHeader title="המועדפים שלך" />
          <RecipeRail recipes={favorites} onPressRecipe={openRecipe} />
        </>
      ),
    },
    spotlight && {
      key: "spotlight",
      node: (
        <>
          <SectionHeader title={`מהמטבח של ${spotlight.contributor}`} />
          <RecipeRail recipes={spotlight.recipes} onPressRecipe={openRecipe} />
        </>
      ),
    },
    recent.length > 0 && {
      key: "recent",
      node: (
        <>
          <SectionHeader title="נוספו לאחרונה" />
          <RecipeRail recipes={recent} onPressRecipe={openRecipe} />
        </>
      ),
    },
    {
      key: "categories",
      node: (
        <>
          <SectionHeader title="קטגוריות" />
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
        </>
      ),
    },
  ].filter(Boolean) as HomeSection[];

  return (
    <Screen>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: tabBarClearance }}
      >
        {sections.map((section, index) => (
          <Animated.View
            key={section.key}
            entering={FadeInDown.delay(index * 70)
              .springify()
              .damping(18)}
            style={styles.section}
          >
            {section.node}
          </Animated.View>
        ))}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  section: {
    marginBottom: spacing.xxl + 4,
  },
  chipsContainer: {
    paddingHorizontal: SCREEN_PADDING_H,
    gap: spacing.sm,
  },
});
