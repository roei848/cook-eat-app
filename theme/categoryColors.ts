import { Category } from "../types/enums/category";

export type CategoryColorEntry = {
  light: string;
  dark: string;
  icon: string;
};

export const CATEGORY_COLORS: Record<Category, CategoryColorEntry> = {
  [Category.SOUP]: {
    light: "#FF8C42",
    dark: "#7A3A10",
    icon: "cafe-outline",
  },
  [Category.SALAD]: {
    light: "#34D399",
    dark: "#065F46",
    icon: "leaf-outline",
  },
  [Category.FIRST_COURSE]: {
    light: "#A78BFA",
    dark: "#4C1D95",
    icon: "restaurant-outline",
  },
  [Category.SIDE]: {
    light: "#60A5FA",
    dark: "#1E3A5F",
    icon: "grid-outline",
  },
  [Category.MAIN_COURSE]: {
    light: "#F87171",
    dark: "#7F1D1D",
    icon: "flame-outline",
  },
  [Category.DESSERT]: {
    light: "#FBBF24",
    dark: "#78350F",
    icon: "ice-cream-outline",
  },
  [Category.DRINK]: {
    light: "#4ADE80",
    dark: "#14532D",
    icon: "wine-outline",
  },
  [Category.OTHER]: {
    light: "#94A3B8",
    dark: "#334155",
    icon: "ellipsis-horizontal-outline",
  },
};
