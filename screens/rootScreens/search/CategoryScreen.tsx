import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { SearchStackParamList } from "./SearchStack";
import { useThemeColors } from "../../../theme/useThemeColors";
import Screen from "../../Screen";
import RecipeCard from "../../../components/recipe/RecipeCard";

type Props = NativeStackScreenProps<SearchStackParamList, "Category">;

export default function CategoryScreen({ route, navigation }: Props) {
  const { recipes } = route.params;
  const colors = useThemeColors();

  console.log(recipes.length);

  return (
    <Screen>
      <View style={styles.container}>
        <FlatList
          data={recipes}
          keyExtractor={(item) => item.id?.toString() ?? item.title}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <RecipeCard
              recipe={item}
              onPress={() => {
                navigation.navigate("Recipe", { recipe: item });
              }}
            />
          )}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
});
