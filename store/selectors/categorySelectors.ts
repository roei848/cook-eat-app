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
 * Two-column grid in count order (canonical order breaks ties). When the
 * category count is odd, the most-populated category leads with a
 * full-width tile so no row is left with a gap.
 */
export const selectBentoRows = createSelector(
  [selectCategorySummaries],
  (summaries): BentoRow[] => {
    const sorted = [...summaries].sort(
      (a, b) =>
        b.count - a.count ||
        CANONICAL_ORDER.indexOf(a.category) - CANONICAL_ORDER.indexOf(b.category)
    );
    const rows: BentoRow[] = [];
    let i = 0;
    if (sorted.length % 2 === 1) {
      rows.push({ type: "full", items: [sorted[0]] });
      i = 1;
    }
    for (; i < sorted.length; i += 2) {
      rows.push({ type: "pair", items: [sorted[i], sorted[i + 1]] });
    }
    return rows;
  }
);
