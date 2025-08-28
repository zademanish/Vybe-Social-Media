import React from "react";
import dp from "../assets/dp.webp";

const NotificationCard = ({ noti }) => {
  return (
    <div className="w-full flex justify-between items-center p-3  text-whtie bg-gradient-to-tr from-[#462c3dc2] via-[#222b24de] to-[#421231c2] shadow-md hover:bg-gray-100 transition duration-200">
      {/* Sender Info */}
      <div className="flex gap-3 items-center">
        <div className="w-12 h-12 rounded-full border-2  overflow-hidden cursor-pointer flex-shrink-0">
          <img
            src={noti?.sender?.profileImage || dp}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col">
          <h1 className="text-white font-semibold text-sm sm:text-base truncate">
            {noti.sender.userName}
          </h1>
          <p className="text-white/60 text-xs sm:text-sm truncate">{noti.message}</p>
        </div>
      </div>

      {/* Media Preview */}
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden border border-gray-300 flex-shrink-0">
        {noti.loop ? (
          <video
            src={noti?.loop?.media}
            loop
            autoPlay
            muted
            className="w-full h-full object-cover"
          />
        ) : noti?.post?.mediaType === "image" ? (
          <img
            src={noti.post?.media}
            alt="Post"
            className="w-full h-full object-cover"
          />
        ) : noti.post ? (
          <video
            src={noti?.post?.media}
            muted
            loop
            autoPlay
            className="w-full h-full object-cover"
          />
        ) : null}
      </div>
    </div>
  );
};

export default NotificationCard;
