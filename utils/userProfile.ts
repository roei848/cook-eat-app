import { UserProfile } from "../types/user";

/** Minimal slice of a Firebase Auth user needed to seed a profile. */
export interface ProfileSeed {
  uid: string;
  email: string | null;
  displayName?: string | null;
  photoURL?: string | null;
}

/**
 * Display name for a profile that is bootstrapped from an auth provider
 * (Google) rather than a registration form: provider name, else the local
 * part of the email, else empty.
 */
export function displayNameFor(seed: Pick<ProfileSeed, "displayName" | "email">): string {
  const name = seed.displayName?.trim();
  if (name) return name;
  const localPart = seed.email?.split("@")[0]?.trim();
  return localPart || "";
}

export function buildNewProfile(input: {
  uid: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  now?: number;
}): UserProfile {
  return {
    uid: input.uid,
    name: input.name,
    email: input.email,
    avatarUrl: input.avatarUrl ?? null,
    createdAt: input.now ?? Date.now(),
    favorites: [],
    darkMode: false,
  };
}

/** Profile for a first-time provider sign-in, seeded from the auth user. */
export function profileFromAuthUser(seed: ProfileSeed, now?: number): UserProfile {
  return buildNewProfile({
    uid: seed.uid,
    name: displayNameFor(seed),
    email: seed.email ?? "",
    avatarUrl: seed.photoURL,
    now,
  });
}
