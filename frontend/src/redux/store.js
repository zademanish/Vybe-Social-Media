import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";
import postSlice from "./slices/postSlice";
import storySlice from "./slices/storySlice";
import loopSlice from "./slices/loopSlice";
import messageSlice from "./slices/messageSlice"
import socketSlice from "./slices/socketSlice"

export const store = configureStore({
  reducer: {
    user: userSlice,
    post: postSlice,
    story: storySlice,
    loop: loopSlice,
    message:messageSlice,
    socket:socketSlice,
  },
});
