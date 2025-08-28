import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "message",
  initialState: {
    selectedUser: null,
    messages: [],
    prevChatUsers: null,
  },
  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      if (!state.messages.find(m => m._id === action.payload._id)) {
        state.messages.push(action.payload);
      }
    },
    setPrevChatUsers: (state, action) => {
      state.prevChatUsers = action.payload;
    },
    clearMessages: (state) => {
      state.messages = [];
    },
  },
});

export const { setSelectedUser, setMessages, addMessage, setPrevChatUsers, clearMessages } = messageSlice.actions;
export default messageSlice.reducer;
