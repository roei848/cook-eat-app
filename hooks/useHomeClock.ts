import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";

import { getDateKey } from "../utils/dailyEdition";

/**
 * The Home screen's clock: `now` drives the masthead greeting/dateline and
 * `dateKey` seeds the daily picks. Refreshed whenever the screen regains
 * focus — a new Date is new state, so returning to Home in the evening
 * re-renders the morning greeting, and crossing midnight rolls the picks
 * without a timer.
 */
export function useHomeClock(): { now: Date; dateKey: string } {
  const [now, setNow] = useState(() => new Date());

  useFocusEffect(
    useCallback(() => {
      setNow(new Date());
    }, [])
  );

  return { now, dateKey: getDateKey(now) };
}
