import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserProfile } from "../types/user";

interface UserState {
  profile: UserProfile | null;
}

const initialState: UserState = {
  profile: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
    clearProfile: (state) => {
      state.profile = null;
    },
    setDarkMode: (state, action) => {
      state.profile!.darkMode = action.payload;
    },
    setFavorites: (state, action: PayloadAction<string[]>) => {
      if (state.profile) state.profile.favorites = action.payload;
    },
  }
});

export const { setProfile, clearProfile, setDarkMode, setFavorites } =
  userSlice.actions;
export default userSlice.reducer;
