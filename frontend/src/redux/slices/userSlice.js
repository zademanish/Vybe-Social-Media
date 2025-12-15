import { createSlice } from "@reduxjs/toolkit";

const storedUser = JSON.parse(localStorage.getItem("userData"));

const initialState = {
  userData: storedUser || null,
  suggestedUsers: null,
  profileData: null,
  following: [],
  searchData: null,
  notificationData: [], // Initial state is an empty array
  loading: true, // prevent flash sign-in
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // ... (setUserData, clearUserData, setSuggestedUsers, setProfileData, etc. remain the same) ...

    setUserData: (state, action) => {
      if (action.payload && typeof action.payload === "object") {
        localStorage.setItem("userData", JSON.stringify(action.payload));
        state.userData = action.payload.user || action.payload;
      } else {
          localStorage.removeItem("userData");
        console.error("Invalid user data:", action.payload);
        state.userData = null;
      }
      state.loading = false;
    },

    clearUserData: (state) => {
      state.userData = null;
      state.loading = false;
    },

    setSuggestedUsers: (state, action) => {
      state.suggestedUsers = action.payload;
    },
    
    setProfileData: (state, action) => {
      state.profileData = action.payload;
    },

    setFollowing: (state, action) => {
      state.following = action.payload;
    },

    setSearchData: (state, action) => {
      state.searchData = action.payload;
    },

    toggleFollow: (state, action) => {
      const targetUserId = action.payload;
      if (state.following.includes(targetUserId)) {
        state.following = state.following.filter((id) => id !== targetUserId);
      } else {
        state.following.push(targetUserId);
      }
    },


    // 🎯 CRITICAL FIX HERE: Replace the entire notification list with the new payload
    setNotificationData: (state, action) => {
        // Ensure the payload is an array (even if it's an empty one)
        const payloadArray = Array.isArray(action.payload) ? action.payload : []; 
        
        // This action is now solely for replacing the list with the server's definitive data
        state.notificationData = payloadArray;
    },

    // Add a single notification (for socket or single push)
    addNotification: (state, action) => {
      // Ensure we add the new notification to the front of the array (unshift)
      const newNoti = action.payload;
      const exists = state.notificationData.some((n) => n._id === newNoti._id);
      if (!exists) {
        state.notificationData.unshift(newNoti);
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
  // Exporting the fixed reducer
  setNotificationData, 
  addNotification,
} = userSlice.actions;

export default userSlice.reducer;