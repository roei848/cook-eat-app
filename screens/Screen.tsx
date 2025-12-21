import React from "react";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useThemeColors } from "../theme/useThemeColors";
import { RootState } from "../store/store";
import { useSelector } from "react-redux";

interface Props {
  children: React.ReactNode;
}

export default function Screen({ children }: Props) {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const isDark = useSelector(
    (state: RootState) => state.user.profile?.darkMode || false
  );

  console.log("isDark", isDark);

  return (
    <>
      <StatusBar
        style={isDark ? "light" : "dark"}
        backgroundColor={colors.background.default}
      />

      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: colors.background.default,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        }}
      >
        {children}
      </SafeAreaView>
    </>
  );
}
