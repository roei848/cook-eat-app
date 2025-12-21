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

  const indicatorTranslate = translateX.interpolate({
    inputRange: [0, 1],
    outputRange: I18nManager.isRTL ? [64, 4] : [4, 64],
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
  );
}

const styles = StyleSheet.create({
  container: {
    height: 48,
    width: 128,
    borderRadius: 24,
    flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
    padding: 4,
    overflow: "hidden",
  },
  indicator: {
    position: "absolute",
    top: 4,
    width: 60,
    height: 40,
    borderRadius: 20,
  },
  option: {
    width: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 1,
  },
});
