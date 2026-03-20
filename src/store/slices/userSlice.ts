'use client';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/src/types';

interface UserState {
  user: User | null
  initialized: boolean
}

const initialState: UserState = {
  user: null,
  initialized: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
    },
    setInitialized(state) {
      state.initialized = true;
    },
    clearUser(state) {
      state.user = null;
    }
  }
});

export const { setUser, setInitialized, clearUser } = userSlice.actions;
export default userSlice.reducer;
