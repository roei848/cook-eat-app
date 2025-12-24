import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Recipe } from "../types/recipe";

type RecipeState = {
  items: Recipe[];
  subscribed: boolean;
};

const initialState: RecipeState = {
  items: [],
  subscribed: false,
};

const recipeSlice = createSlice({
  name: "recipes",
  initialState,
  reducers: {
    setRecipes(state, action: PayloadAction<Recipe[]>) {
      state.items = action.payload;
    },
    setSubscribed(state, action: PayloadAction<boolean>) {
      state.subscribed = action.payload;
    },
    clearRecipes(state) {
      state.items = [];
      state.subscribed = false;
    },
  },
});

export const {
  setRecipes,
  setSubscribed,
  clearRecipes,
} = recipeSlice.actions;

export default recipeSlice.reducer;
