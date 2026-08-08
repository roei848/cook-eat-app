import { useSafeAreaInsets } from "react-native-safe-area-context";

/** Height of the floating pill tab bar. */
export const TAB_BAR_HEIGHT = 64;

/**
 * Minimum gap between the bar and the bottom screen edge. Android with
 * sticky-immersive navigation reports insets.bottom of 0, so this floor
 * keeps the bar off the very edge.
 */
export const TAB_BAR_MARGIN = 12;

/** Bottom offset the floating bar is positioned at. */
export function useTabBarBottomOffset(): number {
  const insets = useSafeAreaInsets();
  return Math.max(insets.bottom, TAB_BAR_MARGIN);
}

/**
 * Bottom padding scrollable content needs so its last items can scroll
 * clear of the floating tab bar.
 */
export function useTabBarClearance(): number {
  return useTabBarBottomOffset() + TAB_BAR_HEIGHT + 12;
}
