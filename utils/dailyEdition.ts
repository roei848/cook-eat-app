/**
 * Pure helpers behind the Home "Daily Edition": the day key that seeds the
 * daily picks, time-of-day copy, and the Hebrew dateline.
 */

/**
 * Local-time day key ("2026-08-09"). Built from local date parts on purpose —
 * toISOString() is UTC and would roll the "day" at 21:00/22:00 Israel time.
 */
export function getDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** djb2 — stable, cheap, good-enough spread for seeding daily picks. */
export function hashString(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export type DayPart = "morning" | "day" | "evening";

export function getDayPart(date: Date): DayPart {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 18) return "day";
  return "evening";
}

const GREETINGS: Record<DayPart, string> = {
  morning: "בוקר טוב",
  day: "צהריים טובים",
  evening: "ערב טוב",
};

const HEADLINES: Record<DayPart, string> = {
  morning: "מה מבשלים הבוקר?",
  day: "מה מבשלים היום?",
  evening: "מה מבשלים הערב?",
};

export const getGreeting = (part: DayPart): string => GREETINGS[part];

export const getHeadline = (part: DayPart): string => HEADLINES[part];

// Hardcoded names instead of toLocaleDateString("he-IL") — Hermes ICU
// locale data isn't guaranteed on all devices.
const HEBREW_WEEKDAYS = [
  "ראשון",
  "שני",
  "שלישי",
  "רביעי",
  "חמישי",
  "שישי",
  "שבת",
] as const;

const HEBREW_MONTHS = [
  "ינואר",
  "פברואר",
  "מרץ",
  "אפריל",
  "מאי",
  "יוני",
  "יולי",
  "אוגוסט",
  "ספטמבר",
  "אוקטובר",
  "נובמבר",
  "דצמבר",
] as const;

/** "יום שישי, 21 באוגוסט" */
export function formatHebrewDateline(date: Date): string {
  const weekday = HEBREW_WEEKDAYS[date.getDay()];
  const month = HEBREW_MONTHS[date.getMonth()];
  return `יום ${weekday}, ${date.getDate()} ב${month}`;
}
