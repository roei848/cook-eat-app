import React from "react";
import { Pressable, Text } from "react-native";
import { useThemeColors } from "../../theme/useThemeColors";

export default function HeaderTextButton({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  const colors = useThemeColors();
  return (
    <Pressable onPress={onPress} style={{ marginHorizontal: 8 }}>
      <Text style={{ color: colors.primary[500], fontWeight: "600" }}>
        {label}
      </Text>
    </Pressable>
  );
}
