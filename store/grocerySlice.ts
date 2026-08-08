import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GroceryItem } from "../types/grocery";

type GroceryState = {
  items: GroceryItem[];
  subscribed: boolean;
  error: string | null;
};

const initialState: GroceryState = {
  items: [],
  subscribed: false,
  error: null,
};

const grocerySlice = createSlice({
  name: "grocery",
  initialState,
  reducers: {
    setGroceryItems(state, action: PayloadAction<GroceryItem[]>) {
      state.items = action.payload;
    },
    setGrocerySubscribed(state, action: PayloadAction<boolean>) {
      state.subscribed = action.payload;
    },
    setGroceryError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    clearGrocery(state) {
      state.items = [];
      state.subscribed = false;
      state.error = null;
    },
  },
});

export const {
  setGroceryItems,
  setGrocerySubscribed,
  setGroceryError,
  clearGrocery,
} = grocerySlice.actions;

export default grocerySlice.reducer;
