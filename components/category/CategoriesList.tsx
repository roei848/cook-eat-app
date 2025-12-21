import React from "react";
import { FlatList, StyleSheet, View } from "react-native";

import CategoryCard from "./CategoryCard";
import { Category } from "../../types/enums/category";
import { useThemeColors } from "../../theme/useThemeColors";
import { ThemeColors } from "../../theme/colors";

type CategoriesListProps = {
  onSelect: (category: Category) => void;
};

const ALL_CATEGORIES: Category[] = [
  Category.SOUP,
  Category.SALAD,
  Category.FIRST_COURSE,
  Category.SIDE,
  Category.MAIN_COURSE,
  Category.DESSERT,
  Category.DRINK,
  Category.OTHER,
];

export default function CategoriesList({ onSelect }: CategoriesListProps) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  return (
    <FlatList
      data={ALL_CATEGORIES}
      keyExtractor={(item) => item}
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <CategoryCard category={item} onPress={() => onSelect(item)} />
        </View>
      )}
    />
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    listContent: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.background.secondary,
    },
    row: {
      justifyContent: "space-between",
      marginBottom: 12,
    },
    item: {
      flex: 1,
      marginHorizontal: 4,
    },
  });
