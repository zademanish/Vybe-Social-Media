import React, { useState } from 'react'
import logo from '../assets/logo2.png';
import { FaRegHeart } from 'react-icons/fa6';
import StoryDp from './StoryDp';
import Nav from './Nav';
import { useSelector } from 'react-redux';
import Post from './Post';
import { BiMessageAltDetail } from "react-icons/bi"
import { useNavigate } from 'react-router-dom';

const Feed = () => {
  const {postData} = useSelector(state=>state.post)
  const {userData} = useSelector(state=>state.user)
  const {notificationData} = useSelector(state=>state.user)
  const navigate = useNavigate()
  const {storyList,currentUserStory} = useSelector(state=>state.story)

  return (
    <div className='lg:w-[40%] w-full min-h-[100vh] lg:h-[100vh] relative lg:overflow-y-auto bg-gradient-to-bl from-[#4F5978] via-[#8765A6] to-[#B8BEB8]'>
      {/* Header */}
      <div className="w-full flex items-center justify-between p-4 h-16 lg:hidden bg-black/70 backdrop-blur-md shadow-md">
        <img src={logo} alt="Logo" className="w-20 transform hover:scale-105 transition-transform duration-200" />
        <div className='flex items-center gap-4'>
          <div className='relative' onClick={() => navigate("/notifications")}>
            <FaRegHeart className="text-white w-7 h-7 hover:text-pink-400 transition-colors duration-200" />
            {notificationData && notificationData.some((noti) => noti.isRead === false) && (
              <div className='w-3 h-3 bg-red-500 rounded-full absolute top-0 right-[-4px] animate-pulse' />
            )}
          </div>
          <BiMessageAltDetail
            onClick={() => navigate("/messages")}
            className="text-white w-7 h-7 hover:text-blue-400 transition-colors duration-200"
          />
        </div>
      </div>

      {/* Stories */}
      <div className='flex w-full overflow-x-auto py-3 gap-3 items-center px-4 border-b border-purple-500/30 '>
        <StoryDp
          userName={"Your Story"}
          ProfileImage={userData.profileImage}
          story={currentUserStory}
          className="transform hover:scale-105 transition-transform duration-200"
        />
        {storyList?.map((story, index) => (
          <StoryDp
            userName={story.author.userName}
            ProfileImage={story.author.profileImage}
            story={story}
            key={index}
            className="transform hover:scale-105 transition-transform duration-200"
          />
        ))}
      </div>

      {/* Posts */}
      <div className='w-full min-h-[100vh] flex flex-col items-center mb-32 gap-8'>
        {postData?.map((post, index) => (
          <Post post={post} key={index} />
        ))}
        <Nav />
      </div>
    </div>
  )
}

export default Feed