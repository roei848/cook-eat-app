import React from "react";
import {
  GestureResponderEvent,
  Pressable,
  PressableProps,
  StyleProp,
  ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

const SPRING = { damping: 15, stiffness: 300 };

type Props = Omit<PressableProps, "style"> & {
  children: React.ReactNode;
  /** Scale while pressed. Default 0.96. */
  scaleTo?: number;
  /** Fire a light haptic impact on press. Default true. */
  haptic?: boolean;
  /** Applied to the inner Animated.View (the scaled surface). */
  style?: StyleProp<ViewStyle>;
};

/**
 * Pressable with the app's standard press-scale spring and a light haptic.
 * Entrance animations are the caller's job — wrap children in their own
 * Animated.View with an `entering` prop when needed.
 */
export default function ScalePressable({
  children,
  scaleTo = 0.96,
  haptic = true,
  style,
  onPress,
  onPressIn,
  onPressOut,
  ...pressableProps
}: Props) {
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = (event: GestureResponderEvent) => {
    if (haptic) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
    onPress?.(event);
  };

  return (
    <Pressable
      {...pressableProps}
      onPress={handlePress}
      onPressIn={(event) => {
        scale.value = withSpring(scaleTo, SPRING);
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        scale.value = withSpring(1, SPRING);
        onPressOut?.(event);
      }}
    >
      <Animated.View style={[style, animStyle]}>{children}</Animated.View>
    </Pressable>
  );
}
