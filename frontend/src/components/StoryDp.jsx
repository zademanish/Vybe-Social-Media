import React, { useEffect, useState } from "react";
import dp from "../assets/dp.webp";
import { FiPlusCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

const StoryDp = ({ ProfileImage, userName, story }) => {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);
  const { storyData, storyList } = useSelector((state) => state.story);

  const [viewed, setViewed] = useState(false);

  const handleViewers = async () => {
    try {
      await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/story/view/${story?._id}`,
        { withCredentials: true }
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (
      story?.viewers?.some(
        (viewer) =>
          viewer?._id?.toString() === userData?._id?.toString() ||
          viewer?.toString() === userData?._id?.toString()
      )
    ) {
      setViewed(true);
    } else {
      setViewed(false);
    }
  }, [story, userData, storyData, storyList]);

  const handleClick = () => {
    if (!story && userName === "Your Story") {
      navigate("/upload");
    } else if (story && userName === "Your Story") {
      handleViewers();
      navigate(`/story/${userData.userName}`);
    } else {
      handleViewers();
      navigate(`/story/${userName}`);
    }
  };

  return (
    <div className="flex flex-col items-center w-[80px]  mx-1">
      <div
        className={`w-[80px] h-[80px] rounded-full p-[2px] cursor-pointer transition-transform duration-300  ${
          !story
            ? "border-2 border-gray-300"
            : !viewed
            ? " bg-gradient-to-tr from-purple-500 via-pink-500 to-yellow-400"
            : " bg-gradient-to-tl from-yellow-400 via-pink-500 to-purple-500"
        } flex justify-center items-center`}
        onClick={handleClick}
      >
        <div className="w-[72px] h-[72px] rounded-full border-4 border-white  overflow-hidden relative">
          <img
            src={ProfileImage || dp}
            alt={userName}
            className="w-full h-full object-cover"
          />
        </div>
          {!story && userName === "Your Story" && (
            <div className="absolute top-30 left-17 sm:top-30 sm:left-17 md:top-30 md:left-17 lg:top-15 lg:left-17 bg-white rounded-full p-[2px] shadow-md">
              <FiPlusCircle className="text-black w-5 h-5" />
            </div>
          )}
      </div>
      <div className="mt-2 text-center text-xs md:text-sm text-white truncate w-full">
        {userName}
      </div>
    </div>
  );
};

export default StoryDp;
