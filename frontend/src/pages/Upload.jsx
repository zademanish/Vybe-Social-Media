import React, { useRef, useState } from "react";
import { FiPlusSquare } from "react-icons/fi";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { IoClose } from "react-icons/io5"; 
import { useNavigate } from "react-router-dom";
import VideoPlayer from "../components/VideoPlayer";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setPostData } from "../redux/slices/postSlice";
import { setCurrentUserStory } from "../redux/slices/storySlice";
import { setLoopData } from "../redux/slices/loopSlice";
import { ClipLoader } from "react-spinners";
import { motion } from "framer-motion";

const Upload = () => {
  const navigate = useNavigate();
  const [uploadType, setUploadType] = useState("post");
  const [frontendMedia, setFrontendMedia] = useState(null);
  const [backendMedia, setBackendMedia] = useState(null);
  const mediaInput = useRef();

  const dispatch = useDispatch();
  const { postData } = useSelector((state) => state.post);
  const { loopData } = useSelector((state) => state.loop);

  const [loading, setLoading] = useState(false);
  const [mediaType, setMediaType] = useState("");
  const [caption, setCaption] = useState("");

  const handleMedia = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type.includes("image")) setMediaType("image");
    else setMediaType("video");

    setBackendMedia(file);
    setFrontendMedia(URL.createObjectURL(file));
  };

  const removeMedia = () => {
    setFrontendMedia(null);
    setBackendMedia(null);
    setCaption("");
    setMediaType("");
    if (mediaInput.current) mediaInput.current.value = "";
  };

  const uploadPost = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("caption", caption);
      formData.append("mediaType", mediaType);
      formData.append("media", backendMedia);

      const result = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/post/upload`,
        formData,
        { withCredentials: true }
      );

      dispatch(setPostData([...postData, result.data]));
      setLoading(false);
      navigate("/");
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const uploadStory = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("mediaType", mediaType);
      formData.append("media", backendMedia);

      const result = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/story/upload`,
        formData,
        { withCredentials: true }
      );

      dispatch(setCurrentUserStory(result.data));
      navigate("/");
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const uploadLoop = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("caption", caption);
      formData.append("media", backendMedia);

      const result = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/loop/upload`,
        formData,
        { withCredentials: true }
      );

      dispatch(setLoopData([...loopData, result.data]));
      navigate("/");
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const handleUpload = () => {
    if (uploadType === "post") uploadPost();
    else if (uploadType === "story") uploadStory();
    else uploadLoop();
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-bl from-[#4F5978] via-[#8765A6] to-[#B8BEB8] flex flex-col items-center overflow-hidden">
      {/* Header */}
      <div className="w-full h-[70px] flex items-center gap-4 px-5 backdrop-blur-md bg-white/70 border-b border-gray-200 shadow-sm">
        <MdOutlineKeyboardBackspace
          onClick={() => navigate("/")}
          className="text-gray-700 w-7 h-7 cursor-pointer hover:scale-110 transition"
        />
        <h1 className="text-gray-900 text-lg font-semibold tracking-wide">
          Upload Media
        </h1>
      </div>

      {/* Toggle Buttons */}
      <div className="w-[90%] max-w-[600px] h-[55px] bg-gray-100 backdrop-blur-md rounded-full flex justify-around items-center gap-3 mt-5 border border-gray-300 shadow-inner">
        {["post", "story", "loop"].map((type) => (
          <motion.div
            key={type}
            whileTap={{ scale: 0.95 }}
            onClick={() => setUploadType(type)}
            className={`${
              uploadType === type
                ? "bg-black text-white font-bold shadow-md"
                : "text-gray-600"
            } w-[30%] h-[75%] flex justify-center items-center text-base rounded-full cursor-pointer transition`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </motion.div>
        ))}
      </div>

      {/* Upload Box */}
      {!frontendMedia && (
        <motion.div
          whileHover={{ scale: 1.02 }}
          onClick={() => mediaInput.current.click()}
          className="w-[85%] max-w-[550px] h-[300px] bg-gradient-to-bl from-[#4F5978] via-[#8765A6] to-[#B8BEB8] border-2 border-dashed border-white flex flex-col items-center justify-center gap-3 mt-20 rounded-2xl cursor-pointer hover:bg-gray-100 transition-all"
        >
          <input
            type="file"
            accept={uploadType === "loop" ? "video/*" : "image/*,video/*"}
            hidden
            ref={mediaInput}
            onChange={handleMedia}
          />
          <FiPlusSquare className="text-white w-10 h-10" />
          <div className="text-white text-lg font-medium">
            Click or drag to upload {uploadType}
          </div>
        </motion.div>
      )}

      {/* Preview */}
      {frontendMedia && (
        <div className="w-[92%] sm:w-[90%] max-w-[550px] mt-6 sm:mt-10 flex flex-col items-center gap-3 sm:gap-4 relative">
          {/* ❌ Remove Button */}
          <button
            onClick={removeMedia}
            className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-white hover:bg-gray-100 text-gray-700 p-1.5 sm:p-2 rounded-full shadow-md border border-gray-300 transition z-10"
          >
            <IoClose size={20} className="sm:w-5 sm:h-5" />
          </button>

          {mediaType === "image" && (
            <img
              src={frontendMedia}
              alt="preview"
              className="rounded-2xl max-h-[250px] sm:max-h-[350px] w-full object-cover border border-gray-300 shadow-md bg-white"
            />
          )}

          {mediaType === "video" && (
            <div className="w-full rounded-2xl overflow-hidden border border-gray-300 shadow-md relative">
              <VideoPlayer media={frontendMedia} />
            </div>
          )}

          {uploadType !== "story" && (
            <input
              type="text"
              className="w-full border-b border-gray-400 bg-transparent text-gray-800 px-2 sm:px-3 py-2 outline-none placeholder-gray-500 text-sm sm:text-base mt-2"
              placeholder="Write a caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          )}
        </div>
      )}

      {/* Upload Button */}
      {frontendMedia && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleUpload}
          className="fixed bottom-10 w-[70%] max-w-[400px] h-[50px] bg-blue-500 text-white font-semibold rounded-2xl shadow-lg hover:bg-blue-600 transition"
        >
          {loading ? (
            <ClipLoader size={28} color="white" />
          ) : (
            `Upload ${uploadType}`
          )}
        </motion.button>
      )}
    </div>
  );
};

export default Upload;
