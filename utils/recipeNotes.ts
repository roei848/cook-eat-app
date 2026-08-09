import { RecipeNote, StoredNote } from "../types/recipe";

/** A note flattened for rendering, with the stored value kept for deletion. */
export type DisplayNote = {
  id: string;
  text: string;
  /** null on legacy string notes — they predate authorship. */
  authorUid: string | null;
  authorName: string | null;
  createdAt: number | null;
  /** The exact value stored in Firestore. arrayRemove matches by value. */
  raw: StoredNote;
};

/**
 * A single user cannot post two notes in the same millisecond, so this is
 * unique without pulling in a uuid dependency (none is installed).
 */
export function makeNoteId(createdAt: number, authorUid: string): string {
  return `${createdAt}-${authorUid}`;
}

function isRecipeNote(note: StoredNote): note is RecipeNote {
  return typeof note === "object" && note !== null && typeof note.text === "string";
}

/**
 * Whether two stored notes are the same note. Strings compare by value
 * (which matches arrayRemove's behaviour, including removing duplicates);
 * objects compare by id.
 */
export function sameStoredNote(a: StoredNote, b: StoredNote): boolean {
  if (typeof a === "string" || typeof b === "string") return a === b;
  return a.id === b.id;
}

/**
 * Flatten stored notes for rendering, oldest first. Legacy string notes have
 * no timestamp and sort first; Array.sort is stable, so they keep their
 * original relative order.
 */
export function normalizeNotes(notes?: StoredNote[]): DisplayNote[] {
  if (!notes?.length) return [];

  const display: DisplayNote[] = notes.map((raw, index) =>
    isRecipeNote(raw)
      ? {
          id: raw.id ?? `note-${index}`,
          text: raw.text,
          authorUid: raw.authorUid ?? null,
          authorName: raw.authorName ?? null,
          createdAt: raw.createdAt ?? null,
          raw,
        }
      : {
          id: `legacy-${index}`,
          text: raw,
          authorUid: null,
          authorName: null,
          createdAt: null,
          raw,
        }
  );

  return display.sort((a, b) => (a.createdAt ?? 0) - (b.createdAt ?? 0));
}

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;

/**
 * Relative Hebrew time. Hebrew has a dual form, so 2 of anything is its own
 * word (שעתיים, יומיים, שבועיים) rather than "2 <plural>".
 *
 * `now` is injected rather than read from Date.now() so this is testable;
 * callers pass Date.now() at render time.
 */
export function formatRelativeHe(ts: number, now: number): string {
  const diff = now - ts;

  // Also covers negative diffs from clock skew or a future timestamp.
  if (diff < MINUTE) return "עכשיו";

  const minutes = Math.floor(diff / MINUTE);
  if (minutes < 60) {
    if (minutes === 1) return "לפני דקה";
    if (minutes === 2) return "לפני שתי דקות";
    return `לפני ${minutes} דקות`;
  }

  const hours = Math.floor(diff / HOUR);
  if (hours < 24) {
    if (hours === 1) return "לפני שעה";
    if (hours === 2) return "לפני שעתיים";
    return `לפני ${hours} שעות`;
  }

  const days = Math.floor(diff / DAY);
  if (days < 7) {
    if (days === 1) return "אתמול";
    if (days === 2) return "לפני יומיים";
    return `לפני ${days} ימים`;
  }

  const weeks = Math.floor(diff / WEEK);
  if (weeks < 5) {
    if (weeks === 1) return "לפני שבוע";
    if (weeks === 2) return "לפני שבועיים";
    return `לפני ${weeks} שבועות`;
  }

  const d = new Date(ts);
  return `${d.getDate()}.${d.getMonth() + 1}.${String(d.getFullYear()).slice(-2)}`;
}
