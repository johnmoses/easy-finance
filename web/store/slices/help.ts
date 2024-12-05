import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IHelpState {
  activeId: any;
  activeCategoryId: any;
  helpModal: number;
  helpBoxOpen: boolean;
}

export const initialState: IHelpState = {
  activeId: null,
  activeCategoryId: null,
  helpModal: 0,
  helpBoxOpen: false,
};

// Slice
export const HelpSlice = createSlice({
  name: "help",
  initialState,
  reducers: {
    setActiveId(state, action: PayloadAction<any>) {
      state.activeId = action.payload;
    },
    unsetActiveId(state) {
      state.activeId = null;
    },
    setActiveCategoryId(state, action: PayloadAction<any>) {
      state.activeCategoryId = action.payload;
    },
    unsetActiveCategoryId(state) {
      state.activeCategoryId = null;
    },
    setHelpModal(state, action: PayloadAction<number>) {
      state.helpModal = action.payload;
    },
    setHelpBoxOpen(state, action: PayloadAction<boolean>) {
      state.helpBoxOpen = action.payload;
    },
  },
});

// Actions
export const {
  setActiveId,
  unsetActiveId,
  setActiveCategoryId,
  unsetActiveCategoryId,
  setHelpModal,
  setHelpBoxOpen,
} = HelpSlice.actions;

// Thunks

export default HelpSlice.reducer;
