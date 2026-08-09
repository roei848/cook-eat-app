import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "../store";
import { Recipe } from "../../types/recipe";
import { hashString } from "../../utils/dailyEdition";

/**
 * Home "Daily Edition" selectors. The ones that rotate daily take a
 * dateKey parameter ("2026-08-09") so the pick is deterministic for the
 * whole day and memoization holds — call as selectX(state, dateKey).
 */

const selectRecipes = (state: RootState) => state.recipes.items;
const selectDateKey = (_: RootState, dateKey: string) => dateKey;

/**
 * Highest-scoring item for the day (rendezvous hashing): each candidate is
 * scored independently of the others, so adding or removing a recipe can't
 * reshuffle the day's pick — unlike hash-modulo-count, which re-indexes on
 * every collection size change.
 */
function pickOfTheDay<T>(items: T[], salt: string, keyOf: (item: T) => string): T | null {
  let best: T | null = null;
  let bestScore = -1;
  for (const item of items) {
    const score = hashString(`${salt}::${keyOf(item)}`);
    if (score > bestScore) {
      best = item;
      bestScore = score;
    }
  }
  return best;
}

export const selectDailyHero = createSelector(
  [selectRecipes, selectDateKey],
  (recipes, dateKey): Recipe | null =>
    pickOfTheDay(recipes, dateKey, (r) => r.id ?? r.title)
);

export const QUICK_PICK_MAX_MINUTES = 30;

export const selectQuickPicks = createSelector(
  [selectRecipes, selectDailyHero],
  (recipes, hero): Recipe[] =>
    recipes
      .filter(
        (r) => r.timeInMinutes <= QUICK_PICK_MAX_MINUTES && r.id !== hero?.id
      )
      .sort(
        (a, b) => a.timeInMinutes - b.timeInMinutes || b.createdAt - a.createdAt
      )
      .slice(0, 10)
);

export const selectRecentRecipes = createSelector(
  [selectRecipes, selectDailyHero],
  (recipes, hero): Recipe[] =>
    [...recipes]
      .sort((a, b) => b.createdAt - a.createdAt)
      .filter((r) => r.id !== hero?.id)
      .slice(0, 10)
);

export type FamilySpotlight = {
  contributor: string;
  recipes: Recipe[];
};

export const selectFamilySpotlight = createSelector(
  [selectRecipes, selectDateKey],
  (recipes, dateKey): FamilySpotlight | null => {
    const byContributor = new Map<string, Recipe[]>();
    for (const recipe of recipes) {
      const name = recipe.byWho?.trim();
      if (!name) continue;
      const group = byContributor.get(name);
      if (group) group.push(recipe);
      else byContributor.set(name, [recipe]);
    }
    // Only contributors with a real body of work qualify for a spotlight.
    const eligible = [...byContributor.entries()].filter(
      ([, group]) => group.length >= 2
    );
    // Different salt than the hero so the two daily picks don't correlate.
    const picked = pickOfTheDay(
      eligible,
      `${dateKey}::spotlight`,
      ([name]) => name
    );
    if (!picked) return null;
    const [contributor, group] = picked;
    return {
      contributor,
      recipes: [...group].sort((a, b) => b.createdAt - a.createdAt),
    };
  }
);

const selectFavoriteIds = (state: RootState) => state.user.profile?.favorites;

export const selectFavoriteRecipes = createSelector(
  [selectRecipes, selectFavoriteIds],
  (recipes, favoriteIds): Recipe[] =>
    (favoriteIds ?? [])
      .map((id) => recipes.find((r) => r.id === id))
      .filter((r): r is Recipe => !!r)
);
