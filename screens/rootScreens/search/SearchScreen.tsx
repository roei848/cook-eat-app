import React, { useState } from "react";

import SearchBar from "../../../components/search/SearchBar";
import Screen from "../../Screen";
import { Category } from "../../../types/enums/category";
import CategoriesList from "../../../components/category/CategoriesList";
import { SearchStackParamList } from "./SearchStack";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

export default function SearchScreen({
  navigation,
}: NativeStackScreenProps<SearchStackParamList, "Search">) {
  const [search, setSearch] = useState("");

  const handleCategorySelect = (category: Category) => {
    navigation.navigate("Category", { category });
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
