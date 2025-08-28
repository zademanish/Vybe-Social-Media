import React, { useEffect, useRef, useState } from "react";
import { FiVolume2, FiVolumeX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import dp from "../assets/dp.webp";
import FollowButton from "./FollowButton";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { useDispatch, useSelector } from "react-redux";
import { MdOutlineComment } from "react-icons/md";
import axios from "axios";
import { setLoopData } from "../redux/slices/loopSlice";
import { IoSendSharp } from "react-icons/io5";

const LoopCard = ({ loop }) => {
  const navigate = useNavigate();
  const videoRef = useRef();
  const commentRef = useRef();
  const dispatch = useDispatch();

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMute, setIsMute] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showHeart, setShowHeart] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [message, setMessage] = useState("");

  const { userData } = useSelector((state) => state.user);
  const { loopData } = useSelector((state) => state.loop);
    const { socket } = useSelector((state) => state.socket);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video) {
      const percent = (video.currentTime / video.duration) * 100;
      setProgress(percent);
    }
  };

  const handleClick = () => {
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const video = videoRef.current;
        if (video) {
          if (entry.isIntersecting) {
            video.play();
            setIsPlaying(true);
          } else {
            video.pause();
            setIsPlaying(false);
          }
        }
      },
      { threshold: 0.6 }
    );

    if (videoRef.current) observer.observe(videoRef.current);

    return () => observer.disconnect();
  }, []);

  const handleLike = async () => {
    try {
      const result = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/loop/like/${loop._id}`,
        { withCredentials: true }
      );
      const updatedLoop = result.data;
      const updatedLoops = loopData.map((p) =>
        p._id === loop._id ? updatedLoop : p
      );
      dispatch(setLoopData(updatedLoops));
    } catch (error) {
      console.log(error);
    }
  };

  const handleComment = async () => {
    try {
      const result = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/loop/comment/${loop._id}`,
        { message },
        { withCredentials: true }
      );
      const updatedLoop = result.data;
      const updatedLoops = loopData.map((p) =>
        p._id === loop._id ? updatedLoop : p
      );
      dispatch(setLoopData(updatedLoops));
      setMessage("");
    } catch (error) {
      setMessage("");
      console.log(error);
    }
  };

  const handleLikeOnDoubleClick = () => {
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 6000); // fixed: 600ms instead of 6000
    if (!loop.likes.includes(userData._id)) {
      handleLike();
    }
  };

  useEffect(() => {
    const handleClickOutSide = (e) => {
      if (commentRef.current && !commentRef.current.contains(e.target)) {
        setShowComment(false);
      }
    };
    if (showComment) {
      document.addEventListener("mousedown", handleClickOutSide);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutSide);
    };
  }, [showComment]);

    useEffect(()=>{
      socket?.on("likedLoop",(updatedData)=>{
         const updatedLoops = loopData?.map(p=>p._id ==updatedData?.loopId ? {...p, likes:updatedData?.likes} : p )
         dispatch(setLoopData(updatedLoops))
      })
  
      socket?.on("commentedLoop",(updatedData)=>{
         const updatedLoops = loopData?.map(p=>p._id ==updatedData?.loopId ? {...p, comments:updatedData?.comments} : p )
         dispatch(setLoopData(updatedLoops))
      })
  
      return ()=>{socket?.off("likedLoop")
        socket?.off("commentedLoop")}
  
    },[socket,loopData,dispatch])

  return (
    <div className="w-full md:w-[480px] h-[100vh] flex items-center   justify-center border-l-2 border-r-2 border-gray-800 relative overflow-hidden">
      {showHeart && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 heart-animation">
          <GoHeartFill className="w-[100px] drop-shadow-2xl h-[100px] text-green-300" />
        </div>
      )}

      {/* comment modal */}
      <div
        ref={commentRef}
        className={`absolute z-[200] bottom-0 w-full h-[500px] p-[10px] rounded-t-4xl bg-gradient-to-bl from-[#4F5978] via-[#8765A6] to-[#B8BEB8] left-0 transition-transform duration-500 ease-in-out shadow-2xl shadow-black ${
          showComment ? "translate-y-0" : "translate-y-[100%]"
        }`}
      >
        <h1 className="text-white text-[20px] text-center font-semibold">
          Comments
        </h1>

        <div className="w-full h-[380px] overflow-y-auto flex flex-col gap-[20px]">
          {loop?.comments?.length === 0 && (
            <div className="text-center text-white text-[20px] font-semibold mt-[50px]">
              No comments Yet
            </div>
          )}
          {loop?.comments?.map((com, index) => (
            <div
              key={com?._id || index}
              className="w-full flex flex-col border-b-[1px] border-white justify-center pb-[8px]  mt-[10px] relative"
            >
              <div className="flex justify-start items-start gap-[10px] md:gap-[20px] ">
                <div className="w-[30px] h-[30px] md:w-[40px] md:h-[40px] rounded-full border-2 border-black overflow-hidden cursor-pointer">
                  <img
                    src={com?.author.profileImage || dp}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-[150px] font-semibold truncate text-white ">
                  {com.author.userName}
                </div>
              </div>
              <div className="text-white pl-[60px] absolute top-5">{com?.message}</div>
            </div>
          ))}
        </div>


        <div className="w-full fixed bottom-0 h-[80px] flex items-center justify-between px-[20px] gap-[10px] py-[20px]">
          <div className="w-[30px] h-[30px]  rounded-full border-2 border-black overflow-hidden cursor-pointer">
            <img
              src={userData?.profileImage || dp}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <input
            type="text"
              placeholder="Write a comment..."
             className="flex-1 px-3 py-2 text-sm rounded-full border border-gray-300 dark:border-gray-600 outline-none text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700"
            onChange={(e) => setMessage(e.target.value)}
             onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleComment();
                            }}}
            value={message}
          />

          {message && (
            <button
              onClick={handleComment}
              className="absolute right-[20px] cursor-pointer"
            >
              <IoSendSharp className="w-[25px] h-[25px] text-black" />
            </button>
          )}
        </div>
      </div>

   <video
  className="w-full h-full object-cover"
  onTimeUpdate={handleTimeUpdate}
  ref={videoRef}
  autoPlay
  loop
  muted={isMute}
  src={loop?.media}
  onClick={handleClick}
  onDoubleClick={handleLikeOnDoubleClick}
/>

      <div
        className="absolute top-[20px] right-[20px] z-[100]"
        onClick={() => setIsMute((prev) => !prev)}
      >
        {!isMute ? (
          <FiVolume2 className="w-[20px] h-[20px] text-white font-semibold" />
        ) : (
          <FiVolumeX className="w-[20px] h-[20px] text-white font-semibold" />
        )}
      </div>

      {/* video progress bar */}
      <div className="absolute bottom-0 w-full h-[5px] bg-gray-900">
        <div
          className="h-full bg-white transition-all duration-200 ease-linear"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* bottom section */}
      <div className="w-full absolute h-[100px] bottom-[10px] px-[10px] flex flex-col gap-[10px]">
        <div className="flex items-center gap-[5px]">
          <div
            className="w-[30px] h-[30px] md:w-[40px] md:h-[40px] rounded-full border-2 border-black overflow-hidden cursor-pointer"
            onClick={() => navigate(`/profile/${loop?.author?.userName}`)}
          >
            <img
              src={loop?.author?.profileImage || dp}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="w-[100px] font-semibold truncate text-white">
            {loop?.author?.userName}
          </div>
          <FollowButton
            targetUserId={loop?.author?._id}
            tailwind="px-[10px] py-[5px] text-white border-2 text-[14px] rounded-2xl border-white cursor-pointer"
          />
        </div>

        <div className="text-white px-[10px]">{loop?.caption}</div>

        {/* like & comment buttons */}
        <div className="absolute right-0 flex flex-col gap-[20px] text-white bottom-[150px] justify-center px-[10px] ">
          <div className="flex flex-col items-center cursor-pointer">
            <div onClick={handleLike}>
              {loop?.likes?.includes(userData?._id) ? (
                <GoHeartFill className="w-[25px] h-[25px] text-red-600" />
              ) : (
                <GoHeart className="w-[25px] h-[25px]" />
              )}
            </div>
            <div>{loop?.likes?.length}</div>
          </div>

          <div
            className="flex flex-col items-center cursor-pointer"
            onClick={() => setShowComment(true)}
          >
            <MdOutlineComment className="w-[25px] h-[25px]" />
            <div>{loop?.comments?.length}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoopCard;
