import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { darkColors, lightColors } from "./colors";

export function useThemeColors() {
  const darkMode = useSelector(
    (state: RootState) => state.user.profile?.darkMode
  );

  return darkMode ? darkColors : lightColors;
}
