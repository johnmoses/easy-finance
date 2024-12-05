import { createSlice } from '@reduxjs/toolkit';
import { IPreferenceBox } from '@/types/preferencebox';

export const initialState: IPreferenceBox = {
    isOpen: false,
};

// Slice
export const PreferenceBoxSlice = createSlice({
  name: 'preferenceBox',
  initialState,
  reducers: {
    openPreferenceBox(state) {
        state.isOpen = true;
      },
    closePreferenceBox(state) {
    state.isOpen = false;
    },
    togglePreferenceBox(state) {
      state.isOpen = !state.isOpen;
    },
  },
});

// Actions
export const { openPreferenceBox, closePreferenceBox, togglePreferenceBox } =
PreferenceBoxSlice.actions;

// Thunks

export default PreferenceBoxSlice.reducer;
