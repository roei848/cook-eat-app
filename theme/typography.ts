/**
 * Typography tokens.
 *
 * Two families:
 *  - Suez One (display) — single 400 weight, Hebrew + Latin. Reserved for
 *    screen titles, bento tile labels, and the recipe hero title.
 *    Hierarchy within display text is expressed by SIZE only.
 *  - Assistant (body/UI) — Hebrew + Latin, weights 400–800.
 *
 * RULE: never set `fontWeight` together with a custom `fontFamily`.
 * On Android that triggers fake-bold or a silent fallback to the system
 * font (which looks jarringly different for Hebrew). Weight is always
 * expressed by picking the family string below.
 *
 * Line heights are ≥1.35× the font size — Suez One's tall Hebrew glyphs
 * clip on Android at anything tighter.
 */
export const fonts = {
  display: "SuezOne_400Regular",
  body: "Assistant_400Regular",
  bodyMedium: "Assistant_500Medium",
  bodySemiBold: "Assistant_600SemiBold",
  bodyBold: "Assistant_700Bold",
  bodyExtraBold: "Assistant_800ExtraBold",
} as const;

export const typography = {
  /** Home headline */
  displayXL: { fontFamily: fonts.display, fontSize: 34, lineHeight: 46 },
  /** Screen titles (Discover), recipe hero title */
  displayL: { fontFamily: fonts.display, fontSize: 28, lineHeight: 38 },
  /** Full-width bento tile labels */
  displayM: { fontFamily: fonts.display, fontSize: 20, lineHeight: 28 },
  /** Half-width bento tile labels */
  displayS: { fontFamily: fonts.display, fontSize: 17, lineHeight: 24 },
  /** Section titles */
  titleL: { fontFamily: fonts.bodyBold, fontSize: 18, lineHeight: 25 },
  /** Card / list-row titles */
  title: { fontFamily: fonts.bodySemiBold, fontSize: 16, lineHeight: 22 },
  body: { fontFamily: fonts.body, fontSize: 15, lineHeight: 22 },
  bodySmall: { fontFamily: fonts.body, fontSize: 13, lineHeight: 19 },
  /** Badges, chips, small emphasized labels */
  label: { fontFamily: fonts.bodySemiBold, fontSize: 13, lineHeight: 18 },
  /** Counts, meta lines */
  caption: { fontFamily: fonts.bodyMedium, fontSize: 12, lineHeight: 17 },
  button: { fontFamily: fonts.bodyBold, fontSize: 16, lineHeight: 22 },
} as const;

export type TypographyVariant = keyof typeof typography;
