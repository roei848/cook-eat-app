import Constants from "expo-constants";
import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";

// Thin wrapper around the native Google Sign-In module. It knows nothing about
// Firebase: it hands back a Google ID token (or null when the user backed out)
// and authService exchanges that for a Firebase session.

const extra = Constants.expoConfig?.extra ?? {};
const webClientId: string | undefined = extra.googleWebClientId;
const iosClientId: string | undefined = extra.googleIosClientId;

let configured = false;

function ensureConfigured() {
  if (configured) return;
  if (!webClientId) {
    throw new GoogleSignInError(
      "Google Sign-In is not configured: set GOOGLE_WEB_CLIENT_ID in .env and rebuild.",
      "NOT_CONFIGURED"
    );
  }
  // webClientId is what makes the native SDK return an idToken.
  GoogleSignin.configure({ webClientId, iosClientId });
  configured = true;
}

export class GoogleSignInError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = "GoogleSignInError";
  }
}

/**
 * Opens the Google account picker and resolves with the ID token.
 * Resolves with `null` when the user cancels — that is not an error.
 * Throws GoogleSignInError for everything else.
 */
export async function requestGoogleIdToken(): Promise<string | null> {
  ensureConfigured();

  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const response = await GoogleSignin.signIn();

    if (!isSuccessResponse(response)) return null;

    const idToken = response.data.idToken;
    if (!idToken) {
      throw new GoogleSignInError(
        "Google did not return an ID token. Check GOOGLE_WEB_CLIENT_ID.",
        "NO_ID_TOKEN"
      );
    }
    return idToken;
  } catch (error) {
    if (error instanceof GoogleSignInError) throw error;

    if (isErrorWithCode(error)) {
      switch (error.code) {
        case statusCodes.SIGN_IN_CANCELLED:
          return null;
        case statusCodes.IN_PROGRESS:
          throw new GoogleSignInError("Sign-in is already in progress.", error.code);
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          throw new GoogleSignInError(
            "Google Play Services are not available on this device.",
            error.code
          );
        default:
          // DEVELOPER_ERROR (code 10) lands here: package name / SHA-1 not
          // registered for this OAuth project. See README → Google Sign-In.
          throw new GoogleSignInError(
            `Google Sign-In failed (${error.code}). ${error.message}`,
            error.code
          );
      }
    }

    throw new GoogleSignInError(
      error instanceof Error ? error.message : "Google Sign-In failed.",
      "UNKNOWN"
    );
  }
}

/** Clears the native Google session so the next sign-in shows the picker. */
export async function signOutOfGoogle(): Promise<void> {
  if (!configured) return;
  try {
    await GoogleSignin.signOut();
  } catch (error) {
    // Firebase sign-out is what matters; a stale native session is harmless.
    console.warn("Google sign-out failed:", error);
  }
}
