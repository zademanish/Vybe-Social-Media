// App.jsx
import React, { useEffect, useRef, lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";

// Frequently used pages (eagerly loaded)
import Messages from "./pages/Messages";
import MessageArea from "./pages/MessageArea";
import ProtectedRoute from "./middlewares/ProtectedRoute";
import useCurrentUser from "./Hooks/useCurrentUser";
import useGetAllLoops from "./Hooks/useGetAllLoops";
import useGetAllNotification from "./Hooks/useGetAllNotification";
import useGetAllPost from "./Hooks/useGetAllPost";
import useGetAllStories from "./Hooks/useGetAllStories";
import useGetFollowingList from "./Hooks/useGetFollowingList";
import useGetPrevChats from "./Hooks/useGetPrevChats";
import useSuggestedUser from "./Hooks/useSuggestedUser";
import { setPostData } from "./redux/slices/postSlice";
import { addNotification } from "./redux/slices/userSlice";
import { addMessage } from "./redux/slices/messageSlice";
import { setOnlineUsers, setSocket } from "./redux/slices/socketSlice";

// Lazy loaded pages
const SignUp = lazy(() => import("./pages/SignUp"));
const SignIn = lazy(() => import("./pages/SignIn"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const Profile = lazy(() => import("./pages/Profile"));
const EditProfile = lazy(() => import("./pages/EditProfile"));
const Upload = lazy(() => import("./pages/Upload"));
const Loops = lazy(() => import("./pages/Loops"));
const Story = lazy(() => import("./pages/Story"));
const Search = lazy(() => import("./pages/Search"));
const Notification = lazy(() => import("./pages/Notification"));
const Home = lazy(() => import("./pages/Home")); // Home in suspense only

const App = () => {
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
            <Messages />
          </ProtectedRoute>
        }
      />
      <Route
        path="/messageArea"
        element={
          <ProtectedRoute user={userData}>
            <MessageArea />
          </ProtectedRoute>
        }
      />
      <Route
        path="/loops"
        element={
          <ProtectedRoute user={userData}>
            <Loops />
          </ProtectedRoute>
        }
      />
      <Route
        path="/search"
        element={
          <ProtectedRoute user={userData}>
            <Search />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute user={userData}>
            <Notification />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
