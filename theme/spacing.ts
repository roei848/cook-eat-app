/**
 * Spacing and radius scales.
 *
 * Radius lock: every redesigned surface picks from this scale —
 *  sm 12 (inputs, thumbnails, badges), md 16 (cards, tiles),
 *  lg 24 (hero cards, sheets), pill (fully rounded bars/FABs).
 */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const radius = {
  sm: 12,
  md: 16,
  lg: 24,
  pill: 999,
} as const;

/** Horizontal gutter for screen-level content. */
export const SCREEN_PADDING_H = 20;
