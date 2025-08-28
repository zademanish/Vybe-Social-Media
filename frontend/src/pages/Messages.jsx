import React from 'react';
import { MdOutlineKeyboardBackspace } from 'react-icons/md';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import OnlineUser from '../components/OnlineUser';
import dp from '../assets/dp.webp';
import { setSelectedUser } from '../redux/slices/messageSlice';

const Messages = () => {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);
  const { onlineUsers } = useSelector((state) => state.socket);
  const { prevChatUsers } = useSelector((state) => state.message);
  const dispatch = useDispatch();

  return (
    <div className="w-full min-h-screen flex flex-col bg-gradient-to-tr from-[#4F5978] via-[#8765A6] to-[#B8BEB8]   p-4 gap-4">
      {/* Header */}
      <div className="flex items-center gap-4 py-2">
        <MdOutlineKeyboardBackspace
          onClick={() => navigate('/')}
          className="text-gray-700 dark:text-gray-200 w-7 h-7 cursor-pointer lg:hidden"
        />
        <h1 className="text-gray-800 dark:text-gray-100 font-bold text-lg md:text-xl">Messages</h1>
      </div>

      {/* Online Users */}
      <div className="flex gap-4 overflow-x-auto py-2 border-b border-gray-300 dark:border-gray-700">
        {userData?.following.map(
          (user) =>
            onlineUsers?.includes(user._id) && (
              <OnlineUser key={user._id} user={user} />
            )
        )}
      </div>

      {/* Previous Chats */}
      <div className="flex flex-col gap-4 overflow-auto h-[calc(100vh-160px)]">
        {prevChatUsers?.map((user) => (
          <div
            key={user._id}
            onClick={() => {
              dispatch(setSelectedUser(user));
              navigate('/messageArea');
            }}
            className="flex items-center gap-4 p-3 rounded-xl bg-gradient-to-tr from-[#462c3dc2] via-[#222b24de] to-[#421231c2] shadow hover:shadow-md transition cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-700">
              <img
                src={user?.profileImage || dp}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-gray-100">
                {user.userName}
              </span>
              {onlineUsers?.includes(user._id) && (
                <span className="text-green-600  text-sm">Active now</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Messages;
