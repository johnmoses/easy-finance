import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IChatState {
  activeId: any;
  activeName: string;
  isPrivate: boolean;
  isBot: boolean;
  chatModal: number;
  unreadMessages: number;
}

export const initialState: IChatState = {
  activeId: null,
  activeName: '',
  isPrivate: false,
  isBot: false,
  chatModal: 0,
  unreadMessages: 0,
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
    setActiveName(state, action: PayloadAction<any>) {
      state.activeName = action.payload;
    },
    setPrivate(state, action: PayloadAction<boolean>) {
      state.isPrivate = action.payload;
    },
    setBot(state, action: PayloadAction<boolean>) {
      state.isBot = action.payload;
    },
    setChatModal(state, action: PayloadAction<number>) {
      state.chatModal = action.payload;
    },
    setUnreadMessages(state, action: PayloadAction<number>) {
      state.unreadMessages = action.payload;
    },
  },
});

// Actions
export const { setActiveId, unsetActiveId, setActiveName, setPrivate, setBot, setChatModal, setUnreadMessages } =
  ChatSlice.actions;

// Thunks

export default ChatSlice.reducer;
