import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";
import { useSelector } from "react-redux";

import { RootState } from "../store/store";
import { RecipeNote, StoredNote } from "../types/recipe";
import {
  DisplayNote,
  makeNoteId,
  normalizeNotes,
  sameStoredNote,
} from "../utils/recipeNotes";
import {
  addRecipeNote,
  removeRecipeNote,
} from "../services/firebase/recipeService";

/**
 * Notes state for one recipe: normalization plus optimistic add/delete with
 * rollback, modelled on useFavorite.
 *
 * Unlike favorites, notes DO echo back through the recipes onSnapshot, so the
 * local state here is only a short-lived overlay that the snapshot supersedes.
 */
export function useRecipeNotes(recipeId: string, notes?: StoredNote[]) {
  const uid = useSelector((state: RootState) => state.auth.user?.uid);
  const authorName = useSelector((state: RootState) => state.user.profile?.name);

  /** Written locally, not yet confirmed by the snapshot. */
  const [pending, setPending] = useState<RecipeNote[]>([]);
  /** Deleted locally, not yet gone from the snapshot. Held by stored value. */
  const [pendingDeletes, setPendingDeletes] = useState<StoredNote[]>([]);

  // Drop overlay entries the snapshot has caught up on. Returning the previous
  // reference when nothing changed keeps this from looping.
  useEffect(() => {
    const stored = notes ?? [];

    setPending((prev) => {
      const next = prev.filter((p) => !stored.some((s) => sameStoredNote(s, p)));
      return next.length === prev.length ? prev : next;
    });

    setPendingDeletes((prev) => {
      const next = prev.filter((d) => stored.some((s) => sameStoredNote(s, d)));
      return next.length === prev.length ? prev : next;
    });
  }, [notes]);

  const displayNotes = useMemo(() => {
    const stored = notes ?? [];
    // Also filter here, not just in the effect: the effect runs after paint,
    // and without this a confirmed note renders twice for one frame.
    const unconfirmed = pending.filter(
      (p) => !stored.some((s) => sameStoredNote(s, p))
    );

    return normalizeNotes([...stored, ...unconfirmed]).filter(
      (n) => !pendingDeletes.some((d) => sameStoredNote(d, n.raw))
    );
  }, [notes, pending, pendingDeletes]);

  const addNote = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || !uid || !authorName) return;

      const createdAt = Date.now();
      const note: RecipeNote = {
        id: makeNoteId(createdAt, uid),
        text: trimmed,
        authorUid: uid,
        authorName,
        createdAt,
      };

      setPending((prev) => [...prev, note]);

      addRecipeNote(recipeId, note).catch(() => {
        setPending((prev) => prev.filter((p) => p.id !== note.id));
        Alert.alert("שמירה נכשלה", "נסה שוב");
      });
    },
    [recipeId, uid, authorName]
  );

  const removeNote = useCallback(
    (note: DisplayNote) => {
      const raw = note.raw;
      setPendingDeletes((prev) => [...prev, raw]);

      removeRecipeNote(recipeId, raw).catch(() => {
        setPendingDeletes((prev) => prev.filter((d) => !sameStoredNote(d, raw)));
        Alert.alert("מחיקה נכשלה", "נסה שוב");
      });
    },
    [recipeId]
  );

  return {
    displayNotes,
    addNote,
    removeNote,
    currentUid: uid,
    // No signed-in profile yet → hide the composer rather than write a note
    // with an empty author.
    canWrite: Boolean(uid && authorName),
  };
}
