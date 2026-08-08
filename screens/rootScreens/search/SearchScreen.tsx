import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import Screen from "../../Screen";
import SearchBar from "../../../components/search/SearchBar";
import SearchResultRow from "../../../components/search/SearchResultRow";
import CategoryBentoGrid from "../../../components/category/CategoryBentoGrid";
import Loader from "../../../components/shared/Loader";
import { RootState } from "../../../store/store";
import { SearchStackParamList } from "./SearchStack";
import { Category } from "../../../types/enums/category";
import { Recipe } from "../../../types/recipe";
import { useThemeColors } from "../../../theme/useThemeColors";
import { ThemeColors } from "../../../theme/colors";
import { typography } from "../../../theme/typography";
import { SCREEN_PADDING_H, spacing } from "../../../theme/spacing";
import { useTabBarClearance } from "../../../theme/layout";

const matchesQuery = (recipe: Recipe, query: string): boolean => {
  const q = query.toLowerCase();
  if (recipe.title.toLowerCase().includes(q)) return true;
  if (recipe.byWho.toLowerCase().includes(q)) return true;
  if (recipe.category.toLowerCase().includes(q)) return true;
  return recipe.ingredients.some((ing) =>
    ing.name.toLowerCase().includes(q)
  );
};

export default function SearchScreen({
  navigation,
}: NativeStackScreenProps<SearchStackParamList, "Search">) {
  const colors = useThemeColors();
  const styles = createStyles(colors);
  const tabBarClearance = useTabBarClearance();
  const recipes = useSelector((state: RootState) => state.recipes.items);
  const subscribed = useSelector(
    (state: RootState) => state.recipes.subscribed
  );
  const [search, setSearch] = useState("");

  const query = search.trim();
  const results = useMemo(
    () => (query ? recipes.filter((r) => matchesQuery(r, query)) : []),
    [recipes, query]
  );

  const handleCategorySelect = (category: Category) => {
    navigation.navigate("Category", { category });
  };

  return (
    <Screen>
      {/* The header (title + SearchBar) stays outside the swapped
          grid/results containers so the input never remounts and
          keyboard focus survives the browse↔results switch. */}
      <View style={styles.header}>
        <Text style={styles.title}>גלה מתכונים</Text>
        <Text style={styles.subtitle}>
          {recipes.length} מתכונים מהמשפחה
        </Text>
      </View>
      <SearchBar
        value={search}
        onChangeText={setSearch}
        placeholder="חיפוש מתכונים..."
      />
      {!subscribed ? (
        <View style={styles.centered}>
          <Loader size={140} />
        </View>
      ) : query ? (
        results.length > 0 ? (
          <FlatList
            data={results}
            keyExtractor={(item) => item.id ?? item.title}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={[
              styles.resultsContent,
              { paddingBottom: tabBarClearance },
            ]}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <Text style={styles.resultsCount}>
                נמצאו {results.length} מתכונים
              </Text>
            }
            renderItem={({ item }) => (
              <SearchResultRow
                recipe={item}
                onPress={() => navigation.navigate("Recipe", { recipe: item })}
              />
            )}
          />
        ) : (
          <View style={styles.centered}>
            <View style={styles.emptyIconCircle}>
              <Ionicons
                name="search-outline"
                size={34}
                color={colors.text.muted}
              />
            </View>
            <Text style={styles.emptyTitle}>
              לא מצאנו מתכונים עבור ״{query}״
            </Text>
            <Text style={styles.emptyHint}>
              נסו שם מתכון, מרכיב או קטגוריה
            </Text>
          </View>
        )
      ) : (
        <ScrollView
          contentContainerStyle={[
            styles.gridContent,
            { paddingBottom: tabBarClearance },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <CategoryBentoGrid onSelect={handleCategorySelect} />
        </ScrollView>
      )}
    </Screen>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    header: {
      paddingHorizontal: SCREEN_PADDING_H,
      paddingTop: spacing.lg,
      paddingBottom: spacing.md,
    },
    title: {
      ...typography.displayL,
      color: colors.text.primary,
    },
    subtitle: {
      ...typography.bodySmall,
      color: colors.text.secondary,
      marginTop: 2,
    },
    gridContent: {
      paddingHorizontal: SCREEN_PADDING_H,
      paddingTop: spacing.xs,
    },
    resultsContent: {
      paddingHorizontal: SCREEN_PADDING_H,
      gap: spacing.sm + 2,
    },
    resultsCount: {
      ...typography.caption,
      color: colors.text.secondary,
      marginBottom: 2,
    },
    centered: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: SCREEN_PADDING_H * 2,
      gap: spacing.sm,
      paddingBottom: 80,
    },
    emptyIconCircle: {
      width: 72,
      height: 72,
      borderRadius: 36,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.background.secondary,
      marginBottom: spacing.xs,
    },
    emptyTitle: {
      ...typography.title,
      color: colors.text.primary,
      textAlign: "center",
    },
    emptyHint: {
      ...typography.bodySmall,
      color: colors.text.secondary,
      textAlign: "center",
    },
  });
