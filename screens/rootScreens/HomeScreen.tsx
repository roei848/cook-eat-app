import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useSelector } from "react-redux";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import Screen from "../Screen";
import RecipeCardHorizontal from "../../components/recipe/RecipeCardHorizontal";
import { useThemeColors } from "../../theme/useThemeColors";
import { ThemeColors } from "../../theme/colors";
import { RootState } from "../../store/store";
import { CATEGORY_COLORS } from "../../theme/categoryColors";
import { Category } from "../../types/enums/category";
import { HomeStackParamList } from "./home/HomeStack";
import { recipes as mockRecipes } from "../../mocks/recipes";
import { createRecipe } from "../../services/firebase/recipeService";
import { logout } from "../../services/firebase/authService";

const ALL_CATEGORIES = Object.values(Category);

export default function HomeScreen({
  navigation,
}: NativeStackScreenProps<HomeStackParamList, "HomeMain">) {
  const colors = useThemeColors();
  const styles = createStyles(colors);
  const isDark = useSelector(
    (state: RootState) => state.user.profile?.darkMode ?? false,
  );
  const profile = useSelector((state: RootState) => state.user.profile);
  const recipeItems = useSelector((state: RootState) => state.recipes.items);

  const recentRecipes = recipeItems.slice(0, 10);

  const addDummyRecipe = async () => {
    for (const recipe of mockRecipes) {
      await createRecipe(recipe);
      console.log(`added recipe: ${recipe.title}`);
    }
    console.log("adding dummy recipe");
  };

  return (
    <Screen>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>
            {profile?.name ? `שלום, ${profile.name} 👋` : "שלום!"}
          </Text>
          <Text style={styles.headline}>מה נבשל היום?</Text>
        </View>

        {/* Recent recipes horizontal scroll */}
        {recentRecipes.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>מתכונים אחרונים</Text>
            <FlatList
              data={recentRecipes}
              keyExtractor={(item) => item.id ?? item.title}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
              renderItem={({ item }) => (
                <RecipeCardHorizontal
                  recipe={item}
                  onPress={() =>
                    navigation.navigate("Recipe", { recipe: item })
                  }
                />
              )}
            />
          </View>
        )}

        {/* Category chips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>קטגוריות</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsContainer}
          >
            {ALL_CATEGORIES.map((cat) => {
              const entry = CATEGORY_COLORS[cat];
              const chipColor = isDark ? entry.dark : entry.light;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[styles.chip, { backgroundColor: chipColor }]}
                  activeOpacity={0.75}
                >
                  <Text style={styles.chipText}>{cat}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Dev utility */}
        <TouchableOpacity
          style={styles.devButton}
          onPress={addDummyRecipe}
          activeOpacity={0.7}
        >
          <Text style={styles.devButtonText}>+ הוסף מתכונים לדוגמה</Text>
        </TouchableOpacity>
      </ScrollView>
    </Screen>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    scroll: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 32,
    },
    header: {
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 24,
    },
    greeting: {
      fontSize: 16,
      fontWeight: "500",
      color: colors.text.secondary,
      marginBottom: 4,
    },
    headline: {
      fontSize: 30,
      fontWeight: "800",
      color: colors.text.primary,
      letterSpacing: -0.5,
    },
    section: {
      marginBottom: 28,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text.primary,
      paddingHorizontal: 20,
      marginBottom: 14,
    },
    horizontalList: {
      paddingRight: 20,
    },
    chipsContainer: {
      paddingHorizontal: 20,
      gap: 8,
    },
    chip: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
    },
    chipText: {
      fontSize: 13,
      fontWeight: "600",
      color: "#FFFFFF",
    },
    devButton: {
      marginHorizontal: 20,
      marginTop: 8,
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 12,
      backgroundColor: colors.background.secondary,
      alignItems: "center",
    },
    devButtonText: {
      fontSize: 13,
      color: colors.text.muted,
      fontWeight: "500",
    },
  });
