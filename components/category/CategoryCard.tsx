import React from "react";
import { StyleSheet, Text, Pressable, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

import { Category } from "../../types/enums/category";
import { CATEGORY_COLORS } from "../../theme/categoryColors";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

type CategoryCardProps = {
  category: Category;
  onPress?: () => void;
};

export default function CategoryCard({ category, onPress }: CategoryCardProps) {
  const isDark = useSelector(
    (state: RootState) => state.user.profile?.darkMode ?? false
  );
  const entry = CATEGORY_COLORS[category];
  const bgColor = isDark ? entry.dark : entry.light;
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPressIn={() => {
        scale.value = withSpring(0.94, { damping: 15, stiffness: 300 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 15, stiffness: 300 });
      }}
      onPress={onPress}
    >
      <Animated.View style={[styles.card, { backgroundColor: bgColor }, animStyle]}>
        <View style={styles.iconContainer}>
          <Ionicons
            name={entry.icon as any}
            size={28}
            color="rgba(255,255,255,0.95)"
          />
        </View>
        <Text style={styles.label}>{category}</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    paddingVertical: 18,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    gap: 8,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
  },
});
