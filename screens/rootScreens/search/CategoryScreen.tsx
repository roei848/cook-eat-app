import React, { useMemo } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { SearchStackParamList } from "./SearchStack";
import { RootState } from "../../../store/store";
import { useThemeColors } from "../../../theme/useThemeColors";
import { ThemeColors } from "../../../theme/colors";
import { typography } from "../../../theme/typography";
import { spacing } from "../../../theme/spacing";
import { CATEGORY_COLORS } from "../../../theme/categoryColors";
import Screen from "../../Screen";
import RecipeCard from "../../../components/recipe/RecipeCard";

type Props = NativeStackScreenProps<SearchStackParamList, "Category">;

export default function CategoryScreen({ route, navigation }: Props) {
  const { category } = route.params;
  const colors = useThemeColors();
  const styles = createStyles(colors);
  const allRecipes = useSelector((state: RootState) => state.recipes.items);

  // Selecting from Redux (rather than receiving a params array) keeps the
  // list live: recipes added or edited while this screen is open appear.
  const recipes = useMemo(
    () => allRecipes.filter((recipe) => recipe.category === category),
    [allRecipes, category]
  );

  return (
    <Screen withTopInset={false}>
      {recipes.length > 0 ? (
        <FlatList
          data={recipes}
          keyExtractor={(item) => item.id ?? item.title}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <RecipeCard
              recipe={item}
              onPress={() => {
                navigation.navigate("Recipe", { recipe: item });
              }}
            />
          )}
        />
      ) : (
        <View style={styles.empty}>
          <View style={styles.emptyIconCircle}>
            <Ionicons
              name={CATEGORY_COLORS[category].icon as any}
              size={34}
              color={colors.text.muted}
            />
          </View>
          <Text style={styles.emptyTitle}>
            אין עדיין מתכונים בקטגוריה הזו
          </Text>
          <Text style={styles.emptyHint}>
            המתכון הראשון שתוסיפו יופיע כאן
          </Text>
        </View>
      )}
    </Screen>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    listContent: {
      paddingHorizontal: 16,
      paddingVertical: spacing.md,
      paddingBottom: 100,
    },
    empty: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.sm,
      paddingHorizontal: 40,
      paddingBottom: 60,
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
