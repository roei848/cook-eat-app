import { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  I18nManager,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { elevation } from "../../theme/elevation";
import { useThemeColors } from "../../theme/useThemeColors";

type Theme = "light" | "dark";

interface Props {
  value: Theme;
  onChange: (value: Theme) => void;
}

const OPTION_WIDTH = 60;

// In both layouts (RTL `row`, LTR `row-reverse`) the first child sits on the
// right, so the light option is always on the right and dark on the left.
const OPTIONS_DIRECTION = I18nManager.isRTL ? "row" : "row-reverse";

export default function ThemeToggle({ value, onChange }: Props) {
  const colors = useThemeColors();
  const translateX = useRef(
    new Animated.Value(value === "dark" ? 1 : 0)
  ).current;

  const isDark = value === "dark";

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: isDark ? 1 : 0,
      stiffness: 180,
      damping: 20,
      mass: 0.8,
      useNativeDriver: true,
    }).start();
  }, [isDark]);

  // The indicator is laid out in normal flow as the first child, so it rests
  // exactly where the first option (light) is. Dark slides it one option to
  // the left. Transforms are physical pixels, so no RTL branch is needed.
  // (Don't make it `position: "absolute"` without insets: the New
  // Architecture's Yoga places such a view at the container's flex-start,
  // which is the right edge here, not at x = 0.)
  const indicatorTranslate = translateX.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -OPTION_WIDTH],
  });

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.card.default,
          ...(isDark ? elevation.dark : elevation.light),
        },
      ]}
    >
      <Animated.View
        style={[
          styles.indicator,
          {
            backgroundColor: colors.primary[500],
            transform: [{ translateX: indicatorTranslate }],
          },
        ]}
      />

      <View style={styles.options}>
        <TouchableOpacity
          style={styles.option}
          onPress={() => onChange("light")}
          activeOpacity={0.85}
        >
          <Ionicons
            name="sunny"
            size={18}
            color={!isDark ? colors.text.inverse : colors.text.secondary}
          />
          <Text
            style={[
              styles.text,
              {
                color: !isDark ? colors.text.inverse : colors.text.secondary,
              },
            ]}
          >
            בהיר
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.option}
          onPress={() => onChange("dark")}
          activeOpacity={0.85}
        >
          <Ionicons
            name="moon"
            size={18}
            color={isDark ? colors.text.inverse : colors.text.secondary}
          />
          <Text
            style={[
              styles.text,
              {
                color: isDark ? colors.text.inverse : colors.text.secondary,
              },
            ]}
          >
            כהה
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 48,
    width: 128,
    borderRadius: 24,
    flexDirection: OPTIONS_DIRECTION,
    padding: 4,
    overflow: "hidden",
  },
  indicator: {
    width: OPTION_WIDTH,
    height: 40,
    borderRadius: 20,
  },
  options: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: OPTIONS_DIRECTION,
    padding: 4,
  },
  option: {
    width: OPTION_WIDTH,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 1,
  },
});
