import React, { useEffect, useRef, useState } from "react";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { LuImage } from "react-icons/lu";
import { IoMdSend } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import dp from "../assets/dp.webp";
import SenderMessage from "../components/SenderMessage";
import ReceiverMessage from "../components/ReceiverMessage";
import { setMessages, addMessage } from "../redux/slices/messageSlice";

const MessageArea = () => {
  const { selectedUser, messages } = useSelector((state) => state.message);
  const { userData } = useSelector((state) => state.user);
  const { socket } = useSelector((state) => state.socket);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [input, setInput] = useState("");
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const imageInput = useRef();

  // Handle image selection
  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  // Send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input && !backendImage) return;

    try {
      const formData = new FormData();
      formData.append("message", input);
      if (backendImage) formData.append("image", backendImage);

      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/message/send/${selectedUser._id}`,
        formData,
        { withCredentials: true }
      );

      dispatch(addMessage(res.data));
      setInput("");
      setFrontendImage(null);
      setBackendImage(null);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch all previous messages for selected user
  useEffect(() => {
    if (!selectedUser?._id) return;

    const getAllMessages = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/message/getAll/${selectedUser._id}`,
          { withCredentials: true }
        );
        dispatch(setMessages(res.data));
      } catch (err) {
        console.log(err);
      }
    };

    getAllMessages();
  }, [selectedUser, dispatch]);

  // Real-time messages from socket
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (mess) => {
      dispatch(addMessage(mess));
    };

    socket.on("newMessage", handleNewMessage);
    return () => socket.off("newMessage", handleNewMessage);
  }, [socket, dispatch]);

  return (
    <div className="w-full bg-gradient-to-bl from-[#4F5978] via-[#8765A6] to-[#B8BEB8] h-[100vh] relative">
      {/* Header */}
      <div className="flex items-center gap-[15px] px-[20px] py-[10px] fixed top-0 z-[100] bg-gradient-to-bl from-[#4F5978] via-[#8765A6] to-[#B8BEB8] w-full">
        <div className=" h-[80px] flex items-center gap-[20px] px-[20px]">
          <MdOutlineKeyboardBackspace
            onClick={() => navigate(`/`)}
            className="text-white w-[25px] h-[25px] cursor-pointer"
          />
        </div>

        <div
          className="w-[40px] h-[40px] rounded-full border-2 border-black overflow-hidden cursor-pointer"
          onClick={() => navigate(`/profile/${selectedUser?.userName}`)}
        >
          <img
            src={selectedUser?.profileImage || dp}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="text-white text-[18px] font-semibold">
          <div>{selectedUser?.userName}</div>
          <div className="text-[14px] text-white/60">{selectedUser?.name}</div>
        </div>
      </div>

      {/* Messages */}
      <div className="w-full h-[90%] pt-[100px] px-[40px] flex flex-col gap-[50px] overflow-auto ">
        {messages?.map((mess) =>
          mess.sender === userData._id ? (
            <SenderMessage key={mess._id} message={mess} />
          ) : (
            <ReceiverMessage key={mess._id} message={mess} />
          )
        )}
      </div>

      {/* Input Area */}
      <div className="w-full h-[80px] fixed bottom-0 flex justify-center items-center  z-[100]">
        <form
          className="w-[90%] max-w-[800px] h-[80%] rounded-full bg-white text-black flex items-center gap-[10px] px-[20px] relative"
          onSubmit={handleSendMessage}
        >
          {frontendImage && (
            <div className="w-[100px] rounded-2xl h-[100px] absolute top-[-120px] right-[10px] overflow-hidden">
              <img src={frontendImage} alt="" className="h-full object-cover" />
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            hidden
            ref={imageInput}
            onChange={handleImage}
          />

          <input
            type="text"
            placeholder="Message"
            className="w-full h-full px-[20px] text-[18px] outline-0"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <div className="cursor-pointer" onClick={() => imageInput.current.click()}>
            <LuImage className="w-[28px] h-[28px] text-black" />
          </div>

          {(input || frontendImage) && (
            <button className="w-[60px] h-[40px] rounded-full  flex items-center justify-center cursor-pointer">
              <IoMdSend className="w-[28px] h-[28px] text-black" />
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default MessageArea;
