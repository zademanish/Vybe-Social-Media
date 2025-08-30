import React, { useEffect, useRef, lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";

// Frequently used pages (eagerly loaded)
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Upload from "./pages/Upload";
import Story from "./pages/Story";
import NotFound from "./pages/NotFound";

import ProtectedRoute from "./middlewares/ProtectedRoute";

// Hooks
import useCurrentUser from "./Hooks/useCurrentUser";
import useGetAllLoops from "./Hooks/useGetAllLoops";
import useGetAllNotification from "./Hooks/useGetAllNotification";
import useGetAllPost from "./Hooks/useGetAllPost";
import useGetAllStories from "./Hooks/useGetAllStories";
import useGetFollowingList from "./Hooks/useGetFollowingList";
import useGetPrevChats from "./Hooks/useGetPrevChats";
import useSuggestedUser from "./Hooks/useSuggestedUser";

// Redux slices
import { setPostData } from "./redux/slices/postSlice";
import { addNotification } from "./redux/slices/userSlice";
import { addMessage } from "./redux/slices/messageSlice";
import { setOnlineUsers, setSocket } from "./redux/slices/socketSlice";

// Lazy-loaded (in Suspense)
const Home = lazy(() => import("./pages/Home"));
const Loops = lazy(() => import("./pages/Loops"));
const Messages = lazy(() => import("./pages/Messages"));
const MessageArea = lazy(() => import("./pages/MessageArea"));
const Search = lazy(() => import("./pages/Search"));
const Notification = lazy(() => import("./pages/Notification"));

const App = () => {
  // ✅ Call hooks unconditionally (always at top-level)
  useCurrentUser();
  useSuggestedUser();
  useGetAllPost();
  useGetAllLoops();
  useGetAllStories();
  useGetFollowingList();
  useGetPrevChats();
  useGetAllNotification();

  const { userData } = useSelector((state) => state.user);
  const postData = useSelector((state) => state.post.postData);
  const dispatch = useDispatch();
  const socketRef = useRef(null);



  useEffect(() => {
    if (!userData || socketRef.current) return;

    const socketIo = io(import.meta.env.VITE_SERVER_URL, {
      query: { userId: userData._id },
      transports: ["websocket"],
    });

    dispatch(setSocket(socketIo));
    socketRef.current = socketIo;

    socketIo.on("getOnlineUsers", (users) => dispatch(setOnlineUsers(users)));
    socketIo.on("newNotification", (noti) => dispatch(addNotification(noti)));
    socketIo.on("newMessage", (msg) => dispatch(addMessage(msg)));
    socketIo.on("likedPost", (updatedData) => {
      const updatedPosts = postData.map((p) =>
        p._id === updatedData.postId ? { ...p, likes: updatedData.likes } : p
      );
      dispatch(setPostData(updatedPosts));
    });
    socketIo.on("commentedPost", (updatedData) => {
      const updatedPosts = postData.map((p) =>
        p._id === updatedData.postId
          ? { ...p, comments: updatedData.comments }
          : p
      );
      dispatch(setPostData(updatedPosts));
    });

    return () => {
      [
        "getOnlineUsers",
        "newNotification",
        "newMessage",
        "likedPost",
        "commentedPost",
      ].forEach((event) => socketIo.off(event));
      socketIo.disconnect();
      socketRef.current = null;
    };
  }, [userData, dispatch, postData]);

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/signup"
        element={!userData ? <SignUp /> : <Navigate to="/" />}
      />
      <Route
        path="/signin"
        element={!userData ? <SignIn /> : <Navigate to="/" />}
      />
      <Route
        path="/forgot-password"
        element={!userData ? <ForgotPassword /> : <Navigate to="/" />}
      />
      <Route path="*" element={<NotFound />} />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute user={userData}>
            <Suspense fallback={<div className="text-white">Loading Home...</div>}>
              <Home />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/:userName"
        element={
          <ProtectedRoute user={userData}>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/story/:userName"
        element={
          <ProtectedRoute user={userData}>
            <Story />
          </ProtectedRoute>
        }
      />
      <Route
        path="/upload"
        element={
          <ProtectedRoute user={userData}>
            <Upload />
          </ProtectedRoute>
        }
      />
      <Route
        path="/editprofile"
        element={
          <ProtectedRoute user={userData}>
            <EditProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/messages"
        element={
          <ProtectedRoute user={userData}>
            <Suspense fallback={<div className="text-white">Loading Messages...</div>}>
              <Messages />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/messageArea"
        element={
          <ProtectedRoute user={userData}>
            <Suspense fallback={<div className="text-white">Loading Message Area...</div>}>
              <MessageArea />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/loops"
        element={
          <ProtectedRoute user={userData}>
            <Suspense fallback={<div className="text-white">Loading Loops...</div>}>
              <Loops />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/search"
        element={
          <ProtectedRoute user={userData}>
            <Suspense fallback={<div className="text-white">Loading Search...</div>}>
              <Search />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute user={userData}>
            <Suspense fallback={<div className="text-white">Loading Notifications...</div>}>
              <Notification />
            </Suspense>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
