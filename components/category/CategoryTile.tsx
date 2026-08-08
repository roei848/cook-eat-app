import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import Animated, { FadeInDown } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

import ScalePressable from "../ui/ScalePressable";
import { CategorySummary } from "../../store/selectors/categorySelectors";
import { CATEGORY_COLORS, withAlpha } from "../../theme/categoryColors";
import { useThemeColors } from "../../theme/useThemeColors";
import { typography } from "../../theme/typography";
import { radius, spacing } from "../../theme/spacing";
import { RootState } from "../../store/store";

type Props = {
  summary: CategorySummary;
  size: "full" | "half";
  /** Global tile index (0–7) driving the entrance stagger. */
  index: number;
  onPress: () => void;
};

const countLabel = (count: number): string => {
  if (count === 0) return "עוד אין מתכונים";
  if (count === 1) return "מתכון אחד";
  return `${count} מתכונים`;
};

/**
 * Photo-led category tile. When the category has at least one recipe photo,
 * the newest photo becomes the tile. Otherwise a softly tinted surface with
 * the category icon stands in.
 */
export default function CategoryTile({ summary, size, index, onPress }: Props) {
  const colors = useThemeColors();
  const isDark = useSelector(
    (state: RootState) => state.user.profile?.darkMode ?? false
  );
  const entry = CATEGORY_COLORS[summary.category];
  const hasPhoto = !!summary.imageUrl;

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 60).springify().damping(18)}
      style={size === "full" ? styles.fullWrap : styles.halfWrap}
    >
      <ScalePressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`${summary.category}, ${countLabel(summary.count)}`}
        style={[
          styles.tile,
          size === "full" ? styles.fullTile : styles.halfTile,
          !hasPhoto && {
            backgroundColor: isDark
              ? withAlpha(entry.dark, 0.45)
              : withAlpha(entry.light, 0.16),
          },
        ]}
      >
        {hasPhoto ? (
          <>
            <Image
              source={{ uri: summary.imageUrl }}
              style={StyleSheet.absoluteFill}
              resizeMode="cover"
            />
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.35)", "rgba(0,0,0,0.75)"]}
              locations={[0, 0.45, 1]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.scrim}
            />
            <View style={styles.labelBlock}>
              <Text
                style={[
                  size === "full" ? typography.displayM : typography.displayS,
                  styles.photoLabel,
                ]}
                numberOfLines={1}
              >
                {summary.category}
              </Text>
              <Text style={[typography.caption, styles.photoCount]}>
                {countLabel(summary.count)}
              </Text>
            </View>
          </>
        ) : (
          <View style={styles.fallbackContent}>
            <Ionicons
              name={entry.icon as any}
              size={size === "full" ? 52 : 44}
              color={isDark ? withAlpha("#FFFFFF", 0.85) : entry.light}
            />
            <Text
              style={[
                size === "full" ? typography.displayM : typography.displayS,
                { color: colors.text.primary },
              ]}
              numberOfLines={1}
            >
              {summary.category}
            </Text>
            <Text
              style={[typography.caption, { color: colors.text.secondary }]}
            >
              {countLabel(summary.count)}
            </Text>
          </View>
        )}
      </ScalePressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  fullWrap: {
    width: "100%",
  },
  halfWrap: {
    flex: 1,
  },
  tile: {
    borderRadius: radius.md,
    overflow: "hidden",
  },
  fullTile: {
    aspectRatio: 16 / 9,
  },
  halfTile: {
    aspectRatio: 1,
  },
  scrim: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "65%",
  },
  labelBlock: {
    position: "absolute",
    bottom: spacing.md,
    start: spacing.lg,
    end: spacing.lg,
  },
  photoLabel: {
    color: "#FFFFFF",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  photoCount: {
    color: "rgba(255,255,255,0.85)",
    marginTop: 1,
  },
  fallbackContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    padding: spacing.md,
  },
});
