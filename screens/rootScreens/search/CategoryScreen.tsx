import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import Screen from "../../Screen";
import { useThemeColors } from "../../../theme/useThemeColors";
import { SearchStackParamList } from "./SearchStack";
import { ThemeColors } from "../../../theme/colors";

type Props = NativeStackScreenProps<SearchStackParamList, "Category">;

export default function CategoryScreen({ route }: Props) {
  const { category, recipes } = route.params;
  const colors = useThemeColors();
  const styles = createStyles(colors);

  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.title}>{category}</Text>
        <FlatList
          data={recipes}
          renderItem={({ item }) => (
            <Text style={{ color: colors.text.primary }}>{item.title}</Text>
          )}
        />
      </View>
    </Screen>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    title: {
      fontSize: 26,
      fontWeight: "600",
      color: colors.text.primary,
    },
  });
