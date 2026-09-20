import React from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";
import { StatusBar } from "expo-status-bar";

import { RootState } from "../store/store";
import { useThemeColors } from "../theme/useThemeColors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Props {
  children: React.ReactNode;
  /**
   * Pass false on stack screens that render a native header — the header
   * already clears the status bar, so the wrapper's top inset would
   * double the spacing.
   */
  withTopInset?: boolean;
}

export default function Screen({ children, withTopInset = true }: Props) {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const isDark = useSelector(
    (state: RootState) => state.user.profile?.darkMode || false
  );

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* No baked-in bottom padding: the tab bar floats, and content is
          expected to scroll underneath it. Screens pad their scrollables
          with useTabBarClearance(). */}
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background.default,
          paddingTop: withTopInset ? insets.top + 20 : 0,
        }}
      >
        {children}
      </View>
    </>
  );
}
