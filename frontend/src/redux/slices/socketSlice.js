import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  onlineUsers: [],
  socket: null,
};

const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
  },
});

export const { setOnlineUsers, setSocket } = socketSlice.actions;
export default socketSlice.reducer;