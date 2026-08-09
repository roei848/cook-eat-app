import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { useThemeColors } from "../../theme/useThemeColors";
import { typography } from "../../theme/typography";
import { SCREEN_PADDING_H, spacing } from "../../theme/spacing";
import {
  formatHebrewDateline,
  getDayPart,
  getGreeting,
  getHeadline,
} from "../../utils/dailyEdition";

type Props = {
  userName?: string;
  now: Date;
};

/** Dateline + time-aware greeting + headline — the "Daily Edition" masthead. */
export default function HomeMasthead({ userName, now }: Props) {
  const colors = useThemeColors();
  const dayPart = getDayPart(now);

  const greeting = userName
    ? `${getGreeting(dayPart)}, ${userName}`
    : getGreeting(dayPart);

  return (
    <View style={styles.container}>
      <Text style={[styles.dateline, { color: colors.text.muted }]}>
        {formatHebrewDateline(now)}
      </Text>
      <Text style={[styles.greeting, { color: colors.text.secondary }]}>
        {greeting}
      </Text>
      <Text style={[styles.headline, { color: colors.text.primary }]}>
        {getHeadline(dayPart)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SCREEN_PADDING_H,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  dateline: {
    ...typography.caption,
  },
  greeting: {
    ...typography.body,
    marginTop: spacing.xs,
  },
  headline: {
    ...typography.displayXL,
  },
});
