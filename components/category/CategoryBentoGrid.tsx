import React from "react";
import { StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";

import CategoryTile from "./CategoryTile";
import { selectBentoRows } from "../../store/selectors/categorySelectors";
import { Category } from "../../types/enums/category";
import { spacing } from "../../theme/spacing";

type Props = {
  onSelect: (category: Category) => void;
};

/**
 * Mixed-size category grid: [full], [half, half], [half, half], [full],
 * [half, half]. Plain Views rather than a FlatList — eight tiles are cheap,
 * mixed spans don't fit numColumns, and `entering` staggers are only
 * reliable on non-virtualized mounts. Rows auto-mirror under forced RTL.
 */
export default function CategoryBentoGrid({ onSelect }: Props) {
  const rows = useSelector(selectBentoRows);

  let tileIndex = 0;
  return (
    <View style={styles.grid}>
      {rows.map((row, rowIdx) => (
        <View key={rowIdx} style={styles.row}>
          {row.items.map((summary) => (
            <CategoryTile
              key={summary.category}
              summary={summary}
              size={row.type === "full" ? "full" : "half"}
              index={tileIndex++}
              onPress={() => onSelect(summary.category)}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    gap: spacing.md,
  },
  row: {
    flexDirection: "row",
    gap: spacing.md,
  },
});
