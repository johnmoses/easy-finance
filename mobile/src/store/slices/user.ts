import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IUserState {
  activeId: any;
  userModal: number;
}

export const initialState: IUserState = {
  activeId: null,
  userModal: 0,
};

// Slice
export const UserSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setActiveId(state, action: PayloadAction<any>) {
      state.activeId = action.payload;
    },
    unsetActiveId(state) {
      state.activeId = null;
    },
    setUserModal(state, action: PayloadAction<number>) {
      state.userModal = action.payload;
    },
  },
});

// Actions
export const { setActiveId, unsetActiveId, setUserModal } =
  UserSlice.actions;

// Thunks

export default UserSlice.reducer;
