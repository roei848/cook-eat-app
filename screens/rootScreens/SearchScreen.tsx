import React, { useState } from "react";

import SearchBar from "../../components/search/SearchBar";
import Screen from "../Screen";
import { Category } from "../../types/enums/category";
import CategoriesList from "../../components/category/CategoriesList";

export default function SearchScreen() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    console.log("Selected category:", category);
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
