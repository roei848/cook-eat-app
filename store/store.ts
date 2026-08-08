import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import userReducer from "./userSlice";
import recipeReducer from "./recipeSlice";
import groceryReducer from "./grocerySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    recipes: recipeReducer,
    grocery: groceryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
