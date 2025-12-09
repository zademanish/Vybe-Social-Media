import React, { useState } from 'react';
import logo from '../assets/logo2.png';
import { FaRegHeart } from 'react-icons/fa6';
import dp from '../assets/dp.webp';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setUserData } from '../redux/slices/userSlice';
import OtherUser from './OtherUser';
import { useNavigate } from 'react-router-dom';
import Notification from '../pages/Notification';

const LeftHome = () => {
  const { userData, suggestedUsers, notificationData } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const [showNotification, setShowNotification] = useState(false);
  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/auth/signout`, { withCredentials: true });
      dispatch(setUserData(null));
      navigate("/signin");
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className={`hidden lg:flex flex-col w-full lg:w-[30%] h-screen transition-all duration-300 ${showNotification ? "overflow-hidden" : "overflow-auto"}`}>
      
      {/* Logo & Notification Icon */}
      <div className="flex items-center justify-between p-5 ">
        <img src={logo} alt="Logo" className="w-[80px] object-contain" />
        <div className='relative cursor-pointer' onClick={() => setShowNotification(prev => !prev)}>
          <FaRegHeart className="text-white w-6 h-6 hover:text-red-500 transition-colors duration-200" />
          {notificationData && notificationData.some(noti => !noti.isRead) && (
            <span className='absolute top-0 right-[-5px] w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse'></span>
          )}
        </div>
      </div>

      {!showNotification && (
        <>
          {/* User Info */}
          <div className="flex items-center justify-between p-4 ">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full border-2 border-gray-700 overflow-hidden cursor-pointer hover:scale-105 transform transition duration-200">
                <img
                  src={userData?.profileImage || dp}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold text-lg truncate">{userData?.userName || 'Guest'}</span>
                <span className="text-white/70 font-semibold text-sm truncate">{userData?.name || ''}</span>
              </div>
            </div>
            <button
              onClick={handleLogOut}
              className="text-white border px-3  py-2  rounded-lg cursor-pointer font-semibold text-sm hover:underline transition duration-200"
            >
              Log Out
            </button>
          </div>

          {/* Suggested Users */}
          <div className="p-5 flex flex-col gap-4">
            <h2 className="text-white font-semibold text-lg">Suggested Users</h2>
            <div className="flex flex-col gap-3 cursor-pointer">
              {suggestedUsers && suggestedUsers?.map((user, index) => (
                <OtherUser key={index} user={user} />
              ))}
            </div>
          </div>
        </>
      )}

      {/* Notifications */}
      {showNotification && <Notification />}
    </div>
  );
};

export default LeftHome;
