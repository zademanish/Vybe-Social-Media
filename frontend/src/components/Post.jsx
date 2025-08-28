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
    <div className="w-full flex flex-col gap-3 text-white pb-6  shadow-white/20 shadow-md mx-auto overflow-hidden transition">
      {/* Media */}
      <div className="relative w-full flex justify-center">
        {post.mediaType === "image" && (
          <img
            src={post.media}
            alt="Post"
            className="w-full object-cover "
          />
        )}
        {post.mediaType === "video" && <VideoPlayer media={post.media} />}

        {/* Author Info */}
        <div
          className="absolute top-3 left-3 flex items-center gap-2 px-2 py-1 rounded-full text-white cursor-pointer"
          onClick={() => navigate(`/profile/${post.author.userName}`)}
        >
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white">
            <img
              src={post?.author.profileImage || dp}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-semibold text-sm md:text-base">
            {post.author.userName}
          </span>
        </div>

        {/* Follow Button */}
        {userData._id !== post.author._id && (
          <div className="absolute top-3 right-3">
            <FollowButton
              targetUserId={post.author._id}
              tailwind="px-2 py-1 md:px-3 md:py-1   bg-[linear-gradient(270deg,#ff0080,#ff8c00,#40e0d0,#8a2be2,#ff0080)] bg-[length:1000%_1000%] [animation:rainbow_8s_ease_infinite]  hover:shadow-[0_0_20px_#fff,0_0_40px_#fff]  text-white rounded-lg text-sm md:text-base hover:opacity-90 transition"
            />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center px-3 mt-2">
        <div className="flex items-center gap-4">
          {/* Like */}
          <button
            className="flex items-center gap-1 cursor-pointer hover:scale-110 transition"
            onClick={handleLike}
          >
            {post.likes.includes(userData._id) ? (
              <GoHeartFill className="text-red-600 w-6 h-6" />
            ) : (
              <GoHeart className="w-6 h-6" />
            )}
            <span className="text-sm">{post.likes.length}</span>
          </button>

          {/* Comment */}
          <button
            className="flex items-center gap-1 cursor-pointer hover:scale-110 transition"
            onClick={() => setShowComment(true)}
          >
            <MdOutlineComment className="w-6 h-6" />
            <span className="text-sm">{post.comments.length}</span>
          </button>
        </div>

        {/* Save */}
        <button
          className="cursor-pointer hover:scale-110 transition"
          onClick={handleSaved}
        >
          {userData.saved.includes(post._id) ? (
            <GoBookmarkFill className="w-6 h-6" />
          ) : (
            <MdOutlineBookmarkBorder className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Caption */}
      {post.caption && (
        <div className="px-3 text-sm md:text-base">
          <span
            className="font-semibold cursor-pointer hover:underline"
            onClick={() => navigate(`/profile/${post.author.userName}`)}
          >
            @{post.author.userName}
          </span>{" "}
          <span className="text-black">
            # {post.caption}
          </span>
        </div>
      )}

      {/* Comment Modal */}
      {showComment && (
        <>
          {/* Full-screen overlay (dims everything, including Nav) */}
          <div
            className="fixed inset-0 bg-black/50 z-1000"
            onClick={() => setShowComment(false)}
          />

          {/* Bottom sheet content positioned above the Nav */}
          <div className="fixed left-0 right-0 bottom-0 flex justify-center items-end z-1000">
            <div className="w-full md:w-[500px] bg-gradient-to-bl from-[#4F5978] via-[#8765A6] to-[#B8BEB8] rounded-t-2xl max-h-[90vh] flex flex-col shadow-lg">
              {/* Header */}
              <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-white">
                  Comments
                </h2>
                <button
                  onClick={() => setShowComment(false)}
                  className="text-white text-2xl "
                >
                  ✕
                </button>
              </div>

              {/* Comments List */}
              <div className="flex-1 overflow-y-auto px-4 py-2 flex flex-col gap-3">
                {post.comments.map((com, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 p-2 rounded-xl "
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300">
                      <img
                        src={com.author.profileImage || dp}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <span className="font-semibold text-white">{com.author.userName}</span>
                      <p className="text-white/70 text-sm">
                        {com.message}
                      
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={commentsEndRef} />
              </div>

              {/* Comment Input */}
              <div className="flex-shrink-0 px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center gap-2">
                <div className="w-9 h-9 rounded-full overflow-hidden border border-gray-300">
                  <img
                    src={userData.profileImage || dp}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Write a comment..."
                  className="flex-1 px-3 py-2 text-sm rounded-full border border-gray-300 dark:border-gray-600 outline-none text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700"
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
                  className="p-2 rounded-full hover:bg-black dark:hover:bg-gray-600 transition"
                >
                  <IoSendSharp className="w-5 h-5" />
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