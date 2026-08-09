import React from "react";
import { StyleSheet, Text, View } from "react-native";

import FlatButton from "../ui/FlatButton";
import { useThemeColors } from "../../theme/useThemeColors";
import { typography } from "../../theme/typography";
import { SCREEN_PADDING_H, spacing } from "../../theme/spacing";

type Props = {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
};

export default function SectionHeader({ title, actionLabel, onAction }: Props) {
  const colors = useThemeColors();

  return (
    <View style={styles.row}>
      <Text style={[styles.title, { color: colors.text.primary }]}>
        {title}
      </Text>
      {actionLabel && onAction && (
        <FlatButton title={actionLabel} onPress={onAction} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    paddingHorizontal: SCREEN_PADDING_H,
    marginBottom: spacing.md + 2,
  },
  title: {
    ...typography.titleL,
  },
});
