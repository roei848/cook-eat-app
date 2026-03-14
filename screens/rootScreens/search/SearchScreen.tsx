import React, { useState } from "react";
import { useSelector } from "react-redux";
import { View, Text, StyleSheet } from "react-native";

import Screen from "../../Screen";
import SearchBar from "../../../components/search/SearchBar";
import CategoriesList from "../../../components/category/CategoriesList";
import { RootState } from "../../../store/store";
import { SearchStackParamList } from "./SearchStack";
import { Category } from "../../../types/enums/category";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Recipe } from "../../../types/recipe";
import { useThemeColors } from "../../../theme/useThemeColors";
import { ThemeColors } from "../../../theme/colors";

export default function SearchScreen({
  navigation,
}: NativeStackScreenProps<SearchStackParamList, "Search">) {
  const colors = useThemeColors();
  const styles = createStyles(colors);
  const recipes = useSelector((state: RootState) => state.recipes.items);
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
      </View>
      <SearchBar
        value={search}
        onChangeText={setSearch}
        placeholder="חיפוש מתכונים..."
      />
      <CategoriesList onSelect={handleCategorySelect} />
    </Screen>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    header: {
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 8,
    },
    title: {
      fontSize: 28,
      fontWeight: "800",
      color: colors.text.primary,
      letterSpacing: -0.5,
    },
  });
