/**
 * Recipe routes shared by HomeStack and SearchStack (native stacks can't
 * share a registered screen, so each stack registers these itself and
 * merges this type into its param list).
 *
 * Screens receive a recipeId and select the recipe from Redux — the
 * Firestore onSnapshot subscription keeps the store fresh, so views never
 * render a stale route-param copy.
 */
export type SharedRecipeParams = {
  Recipe: { recipeId: string };
  EditRecipe: { recipeId: string };
};
