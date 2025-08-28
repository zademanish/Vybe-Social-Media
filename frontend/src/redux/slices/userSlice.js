import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userData: null,
  suggestedUsers: null,
  profileData: null,
  following: [],
  searchData: null,
  notificationData: [],
  loading: true, // prevent flash sign-in
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Set current user data
    setUserData: (state, action) => {
      if (action.payload && typeof action.payload === "object") {
        state.userData = action.payload.user || action.payload;
      } else {
        console.error("Invalid user data:", action.payload);
        state.userData = null;
      }
      state.loading = false;
    },

    // Clear user data on logout
    clearUserData: (state) => {
      state.userData = null;
      state.loading = false;
    },

    // Suggested users
    setSuggestedUsers: (state, action) => {
      state.suggestedUsers = action.payload;
    },

    // Set notifications (array or single)
    setNotificationData: (state, action) => {
      const newNoti = Array.isArray(action.payload) ? action.payload : [action.payload];

      // Remove duplicates by _id
      const unique = [...state.notificationData, ...newNoti].filter(
        (v, i, a) => a.findIndex((t) => t._id === v._id) === i
      );

      state.notificationData = unique;
    },

    // Add a single notification (for socket)
    addNotification: (state, action) => {
      const exists = state.notificationData.find((n) => n._id === action.payload._id);
      if (!exists) state.notificationData.push(action.payload);
    },

    // Profile data
    setProfileData: (state, action) => {
      state.profileData = action.payload;
    },

    // Following list
    setFollowing: (state, action) => {
      state.following = action.payload;
    },

    // Search results
    setSearchData: (state, action) => {
      state.searchData = action.payload;
    },

    // Toggle follow/unfollow
    toggleFollow: (state, action) => {
      const targetUserId = action.payload;
      if (state.following.includes(targetUserId)) {
        state.following = state.following.filter((id) => id !== targetUserId);
      } else {
        state.following.push(targetUserId);
      }
    },
  },
});

export const {
  setUserData,
  clearUserData,
  setSuggestedUsers,
  setProfileData,
  toggleFollow,
  setFollowing,
  setSearchData,
  setNotificationData,
  addNotification,
} = userSlice.actions;

export default userSlice.reducer;
