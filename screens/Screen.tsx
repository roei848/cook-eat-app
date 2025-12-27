import React from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";
import { StatusBar } from "expo-status-bar";

import { RootState } from "../store/store";
import { useThemeColors } from "../theme/useThemeColors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Props {
  children: React.ReactNode;
}

export default function Screen({ children }: Props) {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const isDark = useSelector(
    (state: RootState) => state.user.profile?.darkMode || false
  );

  return (
    <>
      <StatusBar
        style={isDark ? "light" : "dark"}
        backgroundColor={colors.background.default}
      />

      <View
        style={{
          flex: 1,
          backgroundColor: colors.background.default,
          paddingTop: 20,
          paddingBottom: insets.bottom,
        }}
      >
        {children}
      </View>
    </>
  );
}
