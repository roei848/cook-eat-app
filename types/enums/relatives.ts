export enum Relative {
  VEGETARIAN = "vegetarian",
  VEGAN = "vegan",
  GLUTEN_FREE = "gluten free",
  DAIRY_FREE = "dairy free",
  DIET = "diet",
}

export const titlesToRelatives: Record<Relative, string> = {
  [Relative.VEGETARIAN]: "צמחוני",
  [Relative.VEGAN]: "טבעוני",
  [Relative.GLUTEN_FREE]: "ללא גלוטן",
  [Relative.DAIRY_FREE]: "ללא חלב",
  [Relative.DIET]: "דיאט",
};