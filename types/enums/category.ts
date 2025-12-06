export enum Category {
    SOUP = "soup",
    SALAD = "salad",
    FIRST_COURSE = "first course",
    SIDE = "side",
    MAIN_COURSE = "main course",
    DESSERT = "dessert",
    DRINK = "drink",
    OTHER = "other",
  }

  export const titlesToCategories: Record<Category, string> = {
    [Category.SOUP]: "מרק",
    [Category.SALAD]: "סלט",
    [Category.FIRST_COURSE]: "מנה ראשונה",
    [Category.SIDE]: "תוספת",
    [Category.MAIN_COURSE]: "מנה עיקרית",
    [Category.DESSERT]: "קינוח",
    [Category.DRINK]: "משקה",
    [Category.OTHER]: "אחר",
  }