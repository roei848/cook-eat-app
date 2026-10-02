/**
 * Hebrew copy for sign-in failures.
 *
 * Firebase's own messages are English developer strings
 * ("Firebase: Error (auth/invalid-credential).") and the Google wrapper's
 * are setup hints, so the auth screens never alert either directly — they
 * pass the caught error here and show the result.
 *
 * Deliberately import-free (no firebase / native modules): errors are
 * recognised by their `name` + `code` so this stays a pure, testable map.
 */

export const GENERIC_AUTH_ERROR = "משהו השתבש. נסה שוב";
export const GENERIC_GOOGLE_ERROR = "ההתחברות עם Google נכשלה. נסה שוב";

// Firebase 12 reports a bad email/password pair as `invalid-credential` when
// email-enumeration protection is on (the project default) and as the older
// `user-not-found` / `wrong-password` pair when it is off. All three share one
// wording so the screen can't reveal which half was wrong.
const BAD_CREDENTIALS = "האימייל או הסיסמה שגויים";

const FIREBASE_MESSAGES: Record<string, string> = {
  "auth/invalid-email": "כתובת האימייל אינה תקינה",
  "auth/missing-email": "יש להזין אימייל",
  "auth/missing-password": "יש להזין סיסמה",
  "auth/invalid-credential": BAD_CREDENTIALS,
  "auth/user-not-found": BAD_CREDENTIALS,
  "auth/wrong-password": BAD_CREDENTIALS,
  "auth/user-disabled": "החשבון הזה הושבת",
  "auth/email-already-in-use": "כבר קיים חשבון עם האימייל הזה",
  "auth/account-exists-with-different-credential":
    "כבר קיים חשבון עם האימייל הזה בשיטת התחברות אחרת",
  "auth/weak-password": "הסיסמה חלשה מדי — נדרשים לפחות 6 תווים",
  "auth/too-many-requests": "יותר מדי ניסיונות. נסה שוב מאוחר יותר",
  "auth/network-request-failed": "אין חיבור לאינטרנט. בדוק את החיבור ונסה שוב",
  "auth/operation-not-allowed": "שיטת ההתחברות הזו אינה זמינה כרגע",
};

// Codes are the ones services/firebase/googleSignIn.ts assigns to
// GoogleSignInError (its own stable strings, not the native SDK's).
const GOOGLE_MESSAGES: Record<string, string> = {
  NOT_CONFIGURED: "התחברות עם Google אינה מוגדרת באפליקציה הזו",
  NO_ID_TOKEN: GENERIC_GOOGLE_ERROR,
  IN_PROGRESS: "התחברות עם Google כבר מתבצעת",
  PLAY_SERVICES_NOT_AVAILABLE: "שירותי Google Play אינם זמינים במכשיר הזה",
  UNKNOWN: GENERIC_GOOGLE_ERROR,
};

export function authErrorMessage(error: unknown): string {
  if (typeof error !== "object" || error === null) return GENERIC_AUTH_ERROR;

  const { name, code } = error as { name?: unknown; code?: unknown };
  if (typeof code !== "string") return GENERIC_AUTH_ERROR;

  if (name === "GoogleSignInError") {
    // Unmapped codes are the native SDK's (e.g. "10" = DEVELOPER_ERROR, an
    // unregistered SHA-1). Keep the number visible — it is the one clue that
    // distinguishes a setup problem from a flaky network.
    return GOOGLE_MESSAGES[code] ?? `${GENERIC_GOOGLE_ERROR} (${code})`;
  }

  return FIREBASE_MESSAGES[code] ?? GENERIC_AUTH_ERROR;
}
