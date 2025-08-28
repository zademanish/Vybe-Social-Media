import React from "react";
import { GoHomeFill } from "react-icons/go";
import { FiSearch, FiPlusSquare } from "react-icons/fi";
import { RxVideo } from "react-icons/rx";
import dp from "../assets/dp.webp";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Nav = () => {
  const navigate = useNavigate();
  const {userData} = useSelector(state=>state.user)
  return (
    <div className="w-[90%] lg:w-[40%] h-[80px] bg-gradient-to-tr from-[#4F5978] via-[#8765A6] to-[#B8BEB8] flex justify-around items-center fixed bottom-[20px] rounded-full  z-[100]">
      <div onClick={()=>navigate('/')}>
        <GoHomeFill className="text-white w-[25px] cursor-pointer h-[25px]" />
      </div>
      <div  onClick={()=>navigate('/search')}>
        <FiSearch className="text-white w-[25px] cursor-pointer h-[25px]" />
      </div>
      <div onClick={()=>navigate("/upload")}>
        <FiPlusSquare className="text-white cursor-pointer w-[25px] h-[25px]" />
      </div>
      <div onClick={()=>navigate("/loops")}>
        <RxVideo className="text-white cursor-pointer w-[28px] h-[28px]" />
      </div>
      <div className="w-[40px] h-[40px] rounded-full border-2 border-white overflow-hidden cursor-pointer" onClick={()=>navigate(`/profile/${userData.userName}`)}>
        <img src={userData.profileImage || dp} alt="Profile" className="w-full h-full object-cover" />
      </div>
    </div>
  );
};

export default Nav;
