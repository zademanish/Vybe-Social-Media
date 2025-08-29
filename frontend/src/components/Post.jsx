import React, { useEffect, useState, useRef } from "react";
import dp from "../assets/dp.webp";
import VideoPlayer from "./VideoPlayer";
import { useDispatch, useSelector } from "react-redux";
import { GoBookmarkFill, GoHeart, GoHeartFill } from "react-icons/go";
import { MdOutlineBookmarkBorder, MdOutlineComment } from "react-icons/md";
import { IoSendSharp } from "react-icons/io5";
import axios from "axios";
import { setPostData } from "../redux/slices/postSlice";
import { setUserData } from "../redux/slices/userSlice";
import FollowButton from "./FollowButton";
import { useNavigate } from "react-router-dom";

const Post = ({ post }) => {
  const { userData } = useSelector((state) => state.user);
  const { postData } = useSelector((state) => state.post);
  const [showComment, setShowComment] = useState(false);
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const commentsEndRef = useRef(null);

  // Scroll to bottom
  const scrollToBottom = () => {
    commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleLike = async () => {
    try {
      const isLiked = post.likes.includes(userData._id);
      const newLikes = isLiked
        ? post.likes.filter((id) => id !== userData._id)
        : [...post.likes, userData._id];

      const updatedPosts = postData.map((p) =>
        p._id === post._id ? { ...p, likes: newLikes } : p
      );
      dispatch(setPostData(updatedPosts));

      const result = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/post/like/${post._id}`,
        { withCredentials: true }
      );

      const updatedPost = result.data;
      const finalUpdatedPosts = postData.map((p) =>
        p._id === post._id ? updatedPost : p
      );
      dispatch(setPostData(finalUpdatedPosts));
    } catch (error) {
      console.log(error);
    }
  };

  const handleComment = async () => {
    if (!message.trim()) return;

    try {
      const result = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/post/comment/${post._id}`,
        { message },
        { withCredentials: true }
      );

      const updatedPost = result.data;
      const finalUpdatedPosts = postData.map((p) =>
        p._id === post._id ? updatedPost : p
      );
      dispatch(setPostData(finalUpdatedPosts));
      setMessage("");
      scrollToBottom();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSaved = async () => {
    try {
      const isAlreadySaved = userData.saved.includes(post._id);
      const updatedSaved = isAlreadySaved
        ? userData.saved.filter((id) => id !== post._id)
        : [...userData.saved, post._id];

      dispatch(setUserData({ ...userData, saved: updatedSaved }));

      await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/post/saved/${post._id}`,
        { withCredentials: true }
      );
    } catch (error) {
      console.log(error);
    }
  };

  // Scroll to bottom when modal opens or comments change
  useEffect(() => {
    if (showComment) scrollToBottom();
  }, [showComment, post.comments.length]);

  return (
    <div className="w-full h-full mx-auto flex flex-col pb-2 gap-4 text-white bg-gradient-to-br from-gray-900 via-purple-400 to-gray-900  rounded-2xl shadow-md shadow-purple-500/50 transition-all duration-300 hover:shadow-purple-500/70">
      {/* Media */}
      <div className="relative w-full  flex justify-center overflow-hidden">
        {post.mediaType === "image" && (
          <img
            src={post.media}
            alt="Post"
            className="w-full object-cover"
          />
        )}
        {post.mediaType === "video" && <VideoPlayer media={post.media} />}

        {/* Author Info */}
        <div
          className="absolute top-4 left-4 flex items-center gap-3 px-4 py-2 rounded-full  cursor-pointer transition-all duration-300 "
          onClick={() => navigate(`/profile/${post.author.userName}`)}
        >
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-purple-400 shadow-md">
            <img
              src={post?.author.profileImage || dp}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-bold text-sm md:text-lg tracking-wide">
            {post.author.userName}
          </span>
        </div>

        {/* Follow Button */}
        {userData._id !== post.author._id && (
          <div className="absolute top-4 right-4">
            <FollowButton
              targetUserId={post.author._id}
              tailwind="px-4 py-2 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white rounded-lg text-sm md:text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center px-4 mt-3">
        <div className="flex items-center gap-6">
          {/* Like */}
          <button
            className="flex items-center gap-2 cursor-pointer group transition-all duration-300"
            onClick={handleLike}
          >
            {post.likes.includes(userData._id) ? (
              <GoHeartFill className="text-pink-500 w-7 h-7 group-hover:scale-125 transition-transform duration-200" />
            ) : (
              <GoHeart className="w-7 h-7 text-gray-300 group-hover:text-pink-400 group-hover:scale-125 transition-all duration-200" />
            )}
            <span className="text-sm font-medium">{post.likes.length}</span>
          </button>

          {/* Comment */}
          <button
            className="flex items-center gap-2 cursor-pointer group transition-all duration-300"
            onClick={() => setShowComment(true)}
          >
            <MdOutlineComment className="w-7 h-7 text-gray-300 group-hover:text-blue-400 group-hover:scale-125 transition-all duration-200" />
            <span className="text-sm font-medium">{post.comments.length}</span>
          </button>
        </div>

        {/* Save */}
        <button
          className="cursor-pointer group transition-all duration-300"
          onClick={handleSaved}
        >
          {userData.saved.includes(post._id) ? (
            <GoBookmarkFill className="w-7 h-7 text-yellow-400 group-hover:scale-125 transition-transform duration-200" />
          ) : (
            <MdOutlineBookmarkBorder className="w-7 h-7 text-gray-300 group-hover:text-yellow-400 group-hover:scale-125 transition-all duration-200" />
          )}
        </button>
      </div>

      {/* Caption */}
      {post.caption && (
        <div className="px-4 text-sm md:text-base">
          <span
            className="font-bold cursor-pointer hover:text-purple-400 transition-colors duration-200"
            onClick={() => navigate(`/profile/${post.author.userName}`)}
          >
            @{post.author.userName}
          </span>{" "}
          <span className="text-gray-200 font-medium">
           # {post.caption}
          </span>
        </div>
      )}

      {/* Comment Modal */}
      {showComment && (
        <>
          {/* Full-screen overlay */}
          <div
            className="fixed inset-0 bg-black/70 z-50 backdrop-blur-sm"
            onClick={() => setShowComment(false)}
          />

          {/* Bottom sheet content */}
          <div className="fixed left-0 right-0 bottom-0 flex justify-center items-end z-200">
            <div className="w-full lg:w-[40%] bg-gradient-to-br from-gray-800 via-purple-800 to-indigo-800 rounded-t-3xl max-h-[85vh] flex flex-col shadow-2xl shadow-purple-500/50">
              {/* Header */}
              <div className="flex justify-between items-center p-5 border-b border-purple-500/30">
                <h2 className="text-xl font-bold text-white tracking-wide">
                  Comments
                </h2>
                <button
                  onClick={() => setShowComment(false)}
                  className="text-white text-2xl font-bold hover:text-purple-400 transition-colors duration-200"
                >
                  ✕
                </button>
              </div>

              {/* Comments List */}
              <div className="flex-1 overflow-y-auto px-5 py-3 flex flex-col gap-4">
                {post.comments.map((com, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-xl bg-black/20 backdrop-blur-sm"
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-purple-400">
                      <img
                        src={com?.author?.profileImage || dp}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <span className="font-semibold text-white">{com?.author?.userName}</span>
                      <p className="text-gray-200 text-sm mt-1">
                        {com?.message}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={commentsEndRef} />
              </div>

              {/* Comment Input */}
              <div className="flex-shrink-0 px-5 py-4 border-t border-purple-500/30 flex items-center gap-3 bg-black/20">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-purple-400">
                  <img
                    src={userData.profileImage || dp}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Write a comment..."
                  className="flex-1 px-4 py-2 text-sm rounded-full border border-purple-500/50 bg-gray-900/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleComment();
                    }
                  }}
                />
                <button
                  onClick={handleComment}
                  className="p-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 hover:bg-gradient-to-l hover:shadow-lg transition-all duration-300"
                >
                  <IoSendSharp className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Post;