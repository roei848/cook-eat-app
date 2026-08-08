import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "../store";
import { Category } from "../../types/enums/category";

export type CategorySummary = {
  category: Category;
  count: number;
  /** Photo of the newest recipe in the category that has one. */
  imageUrl?: string;
};

const CANONICAL_ORDER = Object.values(Category);

const selectRecipes = (state: RootState) => state.recipes.items;

export const selectCategorySummaries = createSelector(
  [selectRecipes],
  (recipes): CategorySummary[] =>
    CANONICAL_ORDER.map((category) => {
      const inCategory = recipes.filter((r) => r.category === category);
      // Sort by createdAt so the tile photo is deterministic (Firestore
      // snapshot order is not guaranteed stable) and new photos surface.
      const newestWithPhoto = inCategory
        .filter((r) => !!r.imageUrl)
        .sort((a, b) => b.createdAt - a.createdAt)[0];
      return {
        category,
        count: inCategory.length,
        imageUrl: newestWithPhoto?.imageUrl,
      };
    })
);

export type BentoRow =
  | { type: "full"; items: [CategorySummary] }
  | { type: "pair"; items: [CategorySummary, CategorySummary] };

/**
 * Deterministic bento pattern for the 8 categories:
 * [full], [half, half], [half, half], [full], [half, half].
 * The two most-populated categories get the full-width photo tiles; the
 * rest fill the half rows in count order (canonical order breaks ties).
 */
export const selectBentoRows = createSelector(
  [selectCategorySummaries],
  (summaries): BentoRow[] => {
    const sorted = [...summaries].sort(
      (a, b) =>
        b.count - a.count ||
        CANONICAL_ORDER.indexOf(a.category) - CANONICAL_ORDER.indexOf(b.category)
    );
    const [first, second, ...rest] = sorted;
    return [
      { type: "full", items: [first] },
      { type: "pair", items: [rest[0], rest[1]] },
      { type: "pair", items: [rest[2], rest[3]] },
      { type: "full", items: [second] },
      { type: "pair", items: [rest[4], rest[5]] },
    ];
  }
);
