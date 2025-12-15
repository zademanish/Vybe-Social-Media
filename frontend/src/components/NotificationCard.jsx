import React from "react";
import dp from "../assets/dp.webp"; // Assuming this path is correct
import { useNavigate } from "react-router-dom";

const NotificationCard = ({ noti }) => {
  const navigate = useNavigate();

  // Determine media content to display
  let mediaContent = null;
  if (noti.loop) {
    mediaContent = (
      <video
        src={noti?.loop?.media}
        loop
        autoPlay
        muted
        className="w-full h-full object-cover"
      />
    );
  } else if (noti.post) {
    if (noti?.post?.mediaType === "image") {
      mediaContent = (
        <img
          src={noti?.post?.media}
          alt="Post"
          className="w-full h-full object-cover"
        />
      );
    } else { // Assuming 'video' or other media type
      mediaContent = (
        <video
          src={noti?.post?.media}
          muted
          loop
          autoPlay
          className="w-full h-full object-cover"
        />
      );
    }
  }

  return (
    <div className="w-full flex justify-between items-center p-3 text-white bg-gradient-to-tr from-[#462c3dc2] via-[#222b24de] to-[#421231c2] shadow-md hover:bg-gray-700/80 transition duration-200 cursor-pointer">
      
      {/* Sender Info */}
      <div 
        className="flex gap-3 items-center flex-grow" 
        onClick={()=>navigate(`/profile/${noti?.sender?.userName}`)}
      >
        <div className="w-12 h-12 rounded-full border-2 border-white/50 overflow-hidden cursor-pointer flex-shrink-0">
          <img
            src={noti?.sender?.profileImage || dp}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col min-w-0">
          <h1 className="text-white font-semibold text-sm sm:text-base truncate">
            {noti?.sender?.userName}
          </h1>
          <p className="text-white/60 text-xs sm:text-sm truncate">{noti?.message}</p>
        </div>
      </div>

      {/* Media Preview */}
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden border border-gray-500 flex-shrink-0 ml-4">
        {mediaContent}
      </div>
    </div>
  );
};

export default NotificationCard;