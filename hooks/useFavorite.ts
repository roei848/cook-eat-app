import { useCallback } from "react";
import { Alert } from "react-native";
import { useDispatch, useSelector, useStore } from "react-redux";

import { RootState } from "../store/store";
import { setFavorites } from "../store/userSlice";
import { setRecipeFavorite } from "../services/firebase/userService";

/**
 * Favorite state + toggle for a recipe. The Redux update is optimistic and
 * required: there is no users/{uid} onSnapshot, so nothing else would echo
 * the Firestore write back into the store.
 */
export function useFavorite(recipeId: string | undefined): {
  isFavorite: boolean;
  toggleFavorite: () => void;
} {
  const dispatch = useDispatch();
  const store = useStore<RootState>();
  const profile = useSelector((state: RootState) => state.user.profile);

  const favorites = profile?.favorites ?? [];
  const isFavorite = !!recipeId && favorites.includes(recipeId);

  const toggleFavorite = useCallback(() => {
    if (!profile || !recipeId) return;
    const next = isFavorite
      ? favorites.filter((id) => id !== recipeId)
      : [...favorites, recipeId];

    dispatch(setFavorites(next));
    setRecipeFavorite(profile.uid, recipeId, !isFavorite).catch(() => {
      // Revert only this recipe, against the list as it is NOW — restoring
      // the pre-toggle snapshot would clobber any toggle that succeeded in
      // the meantime.
      const latest = store.getState().user.profile?.favorites ?? [];
      const reverted = isFavorite
        ? latest.includes(recipeId)
          ? latest
          : [...latest, recipeId]
        : latest.filter((id) => id !== recipeId);
      dispatch(setFavorites(reverted));
      Alert.alert("שמירה נכשלה", "נסה שוב");
    });
  }, [dispatch, store, profile, recipeId, isFavorite, favorites]);

  return { isFavorite, toggleFavorite };
}
