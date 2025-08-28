import React, { useEffect, useState } from "react";
import dp from "../assets/dp.webp";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import VideoPlayer from "./VideoPlayer";
import { FaEye } from "react-icons/fa6";
import { FiEye } from "react-icons/fi";

const StoryCard = ({ storyData }) => {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);
  const [showViewers, setShowViewers] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          navigate("/");
          return 100;
        }
        return prev + 1;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="w-full max-w-[500px] h-[100vh]  relative flex flex-col justify-center">
      <div className="flex items-center gap-[10px] absolute top-[20px] px-[10px]">
        <MdOutlineKeyboardBackspace
          onClick={() => navigate(`/`)}
          className="text-white w-[25px] h-[25px] cursor-pointer"
        />
        <div
          className="w-[50px] h-[50px] rounded-full border border-white overflow-hidden cursor-pointer"
          onClick={() => navigate(`/profile/${storyData?.author?.userName}`)}
        >
          <img
            src={storyData?.author?.profileImage || dp}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="w-[100px] font-semibold truncate text-white">
          {storyData?.author?.userName}
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute top-[5px] w-full h-[2px] ">
        <div
          className="h-full transition-all bg-white duration-200 ease-linear"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* story */}

      {!showViewers && (
        <>
          <div className="w-full h-[100%] flex items-center justify-center ">
            {storyData?.mediaType == "image" && (
              <div className="w-[100%] h-full flex items-center justify-center">
                <img
                  src={storyData.media}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            {storyData?.mediaType == "video" && (
              <div className="w-[80%] flex items-center justify-center ">
                <VideoPlayer media={storyData.media} />
              </div>
            )}
          </div>

          {storyData?.author?.userName == userData?.userName && (
            <div className="w-full h-[70px] p-2 flex items-center gap-[10px] left-0 text-white absolute bottom-0 cursor-pointer" onClick={()=>setShowViewers(true)}>
              <div className="text-white flex items-center gap-[5px]">
                {" "}
                <FaEye />
                {storyData.viewers.length}
              </div>
              <div className="flex relative">
                {storyData?.viewers?.slice(0, 3).map((viewer, index) => (
                  <div
                    className={`w-[30px] h-[30px] rounded-full border-2 border-white overflow-hidden cursor-pointer ${
                      index > 0 ? `absolute left-[${index * 10}px]` : ""
                    }`}
                  >
                    <img
                      src={viewer?.profileImage || dp}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {showViewers && (
        <>
          <div className="w-full h-[30%] flex items-center justify-center mt-[100px] py-[30px]  overflow-hidden cursor-pointer" onClick={()=>setShowViewers(false)}>
            {storyData?.mediaType == "image" && (
              <div className="h-full flex items-center justify-center ">
                <img
                  src={storyData.media}
                  alt=""
                  className="h-full  object-cover"
                />
              </div>
            )}
            {storyData?.mediaType == "video" && (
              <div className="h-full flex items-center justify-center ">
                <VideoPlayer media={storyData.media} />
              </div>
            )}
          </div>
          <div className="w-full h-[70%] text-white border-t-2 border-t-gray-300 p-[20px] ">
            <div className=" flex items-center gap-[10px]">
              <FiEye  className="text-white"/>
              <span className="text-white">
                {storyData?.viewers?.length}
              </span>
                <span > Viewers</span>
            </div>
              <div className="w-full max-h-full flex flex-col gap-[10px] overflow-auto pt-[20px]">
        {storyData?.viewers.map((viewer, index) => (
          <div className="w-full flex items-center gap-[20px]">
            <div
              className="w-[30px] h-[30px] md:w-[40px] md:h-[40px] rounded-full border  overflow-hidden cursor-pointer"
              onClick={() => navigate(`/profile/${viewer?.userName}`)}
            >
              <img
                src={viewer?.profileImage || dp}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
             <div className="w-[100px] font-semibold truncate text-white">
          {viewer?.userName}
        </div>
          </div>
        ))}
      </div>
          </div>
        </>
      )}
    
    </div>
  );
};

export default StoryCard;
