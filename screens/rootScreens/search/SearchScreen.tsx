import React, { useState } from "react";
import { useSelector } from "react-redux";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import Screen from "../../Screen";
import SearchBar from "../../../components/search/SearchBar";
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

export default function SearchScreen({
  navigation,
}: NativeStackScreenProps<SearchStackParamList, "Search">) {
  const colors = useThemeColors();
  const styles = createStyles(colors);
  const recipes = useSelector((state: RootState) => state.recipes.items);
  const subscribed = useSelector(
    (state: RootState) => state.recipes.subscribed
  );
  const [search, setSearch] = useState("");

  const handleCategorySelect = (category: Category) => {
    navigation.navigate("Category", {
      category,
      recipes: recipes.filter(
        (recipe: Recipe) => recipe.category === category
      ) as Recipe[],
    });
  };

  return (
    <Screen>
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
      {subscribed ? (
        <ScrollView
          contentContainerStyle={styles.gridContent}
          showsVerticalScrollIndicator={false}
        >
          <CategoryBentoGrid onSelect={handleCategorySelect} />
        </ScrollView>
      ) : (
        <View style={styles.loading}>
          <Loader size={140} />
        </View>
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
      paddingBottom: 100,
    },
    loading: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
  });
