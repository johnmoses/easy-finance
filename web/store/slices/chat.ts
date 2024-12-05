import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IChatState {
  activeId: any;
  chatModal: number;
  chatBoxOpen: boolean;
}

export const initialState: IChatState = {
  activeId: null,
  chatModal: 0,
  chatBoxOpen: false,
};

// Slice
export const ChatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setActiveId(state, action: PayloadAction<any>) {
      state.activeId = action.payload;
    },
    unsetActiveId(state) {
      state.activeId = null;
    },
    setChatModal(state, action: PayloadAction<number>) {
      state.chatModal = action.payload;
    },
    setChatBoxOpen(state, action: PayloadAction<boolean>) {
      state.chatBoxOpen = action.payload;
    },
  },
});

// Actions
export const { setActiveId, unsetActiveId, setChatModal, setChatBoxOpen } =
  ChatSlice.actions;

// Thunks

export default ChatSlice.reducer;
