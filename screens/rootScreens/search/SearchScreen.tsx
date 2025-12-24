import React, { useState } from "react";
import { useSelector } from "react-redux";
import { FlatList, Text } from "react-native";

import Screen from "../../Screen";
import SearchBar from "../../../components/search/SearchBar";
import CategoriesList from "../../../components/category/CategoriesList";
import { RootState } from "../../../store/store";
import { SearchStackParamList } from "./SearchStack";
import { Category } from "../../../types/enums/category";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Recipe } from "../../../types/recipe";

export default function SearchScreen({
  navigation,
}: NativeStackScreenProps<SearchStackParamList, "Search">) {
  const recipes = useSelector((state: RootState) => state.recipes.items);
  console.log("Recipes:", recipes);
  const [search, setSearch] = useState("");

  const handleCategorySelect = (category: Category) => {
    navigation.navigate("Category", {
      category,
      recipes: recipes.filter((recipe: Recipe) => recipe.category === category) as Recipe[],
    });
  };

  return (
    <Screen>
      <SearchBar
        value={search}
        onChangeText={setSearch}
        placeholder="חיפוש מתכונים..."
      />
      <CategoriesList onSelect={handleCategorySelect} />
    </Screen>
  );
}
