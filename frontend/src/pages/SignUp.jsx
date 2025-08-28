import React, { useState } from "react";
import logo from "../assets/logo1.png";
import logo2 from "../assets/logo2.png";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import axios from "axios";
import { ClipLoader } from "react-spinners"
import {useNavigate} from "react-router-dom"
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/slices/userSlice";
 
const SignUp = () => {
  const [inputClicked, setInputClicked] = useState({
    name: false,
    userName: false,
    email: false,
    password: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading,SetLoading] = useState(false);
  const [name,setName] = useState("")
  const [userName,setUserName] = useState("")
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [error,setError] = useState("")

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleSignUp = async()=>{
    SetLoading(true)
      setError("")
    try {
      const result = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/auth/signup`,
        {name,userName,email,password},
        {withCredentials:true}
      )
     dispatch(setUserData(result.data))
      SetLoading(false)
    } catch (error) {
      setError(error.response?.data?.message)
            SetLoading(false)
      console.log(error);
    }
  }


  return (
    <div className="w-full h-screen bg-gradient-to-tr from-[#4F5978] via-[#8765A6] to-[#B8BEB8] flex flex-col justify-center items-center">
      <div className="w-[90%] lg:max-w-[60%] h-[600px] bg-white rounded-2xl flex justify-center items-center overflow-hidden border-2 border-[#1a1f23]">
        {/* left side form container */}
        <div className="w-full lg:w-[50%] h-full bg-white flex flex-col items-center p-[10px] gap-[20px]">
          <div className=" flex gap-[10px] items-center text-[20px] font-semibold mt-[40px]">
            <span>Sign Up to </span>
            <img className="w-[70px]" src={logo} alt="" />
          </div>
          <div
            className="relative flex items-center justify-start w-[90%] h-[50px] rounded-2xl mt-[30px] border-2 border-black"
            onClick={() => setInputClicked({ ...inputClicked, name: true })}
          >
            <label
              htmlFor="name"
              className={`text-gray-700 absolute left-[20px] px-[4px] font-bold bg-white text-[15px] ${
                inputClicked.name ? "top-[-15px] py-[3px]" : ""
              }`}
            >
              Enter Your Name{" "}
            </label>
            <input
              type="text"
              id="name"
              onChange={(e)=>setName(e.target.value)}
              value={name}
              className="w-[100%] h-[100%] rounded-2xl px-[20px] outline-none border-0 font-semibold"
              required
            />
          </div>

          <div
            className="relative flex items-center justify-start w-[90%] h-[50px] rounded-2xl border-2 border-black"
            onClick={() => setInputClicked({ ...inputClicked, userName: true })}
          >
            <label
              htmlFor="userName"
              className={`text-gray-700 absolute left-[20px]  px-[4px] font-bold bg-white text-[15px] ${
                inputClicked.userName ? "top-[-15px] py-[3px]" : ""
              }`}
            >
              Enter Username{" "}
            </label>
            <input
              type="text"
              id="userName"
              className="w-[100%] h-[100%] rounded-2xl px-[20px] outline-none border-0 font-semibold"
               onChange={(e)=>setUserName(e.target.value)}
              value={userName}
              required
            />
          </div>

          <div
            className="relative flex items-center justify-start w-[90%] h-[50px] rounded-2xl border-2 border-black"
            onClick={() => setInputClicked({ ...inputClicked, email: true })}
          >
            <label
              htmlFor="email"
              className={`text-gray-700 absolute left-[20px] px-[4px] font-bold bg-white text-[15px] ${
                inputClicked.email ? "top-[-15px] py-[3px]" : ""
              }`}
            >
              Enter Your email{" "}
            </label>
            <input
              type="email"
              id="email"
              className="w-[100%] h-[100%] rounded-2xl px-[20px] outline-none border-0 font-semibold"
               onChange={(e)=>setEmail(e.target.value)}
              value={email}
              required
            />
          </div>

          <div
            className="relative flex items-center justify-start w-[90%] h-[50px] rounded-2xl  border-2 border-black"
            onClick={() => setInputClicked({ ...inputClicked, password: true })}
          >
            <label
              htmlFor="password"
              className={`text-gray-700 absolute left-[20px] px-[4px] font-bold bg-white text-[15px] ${
                inputClicked.password ? "top-[-15px] py-[3px]" : ""
              }`}
            >
              Enter Your Password{" "}
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="w-[100%] h-[100%] rounded-2xl px-[20px] outline-none border-0 font-semibold"
               onChange={(e)=>setPassword(e.target.value)}
              value={password}
              required
            />
            {!showPassword ? (
              <IoIosEye
                onClick={() => setShowPassword(true)}
                className="absolute cursor-pointer right-[20px] w-[25px] h-[25px]"
              />
            ) : (
              <IoIosEyeOff
                className="absolute cursor-pointer right-[20px] w-[25px] h-[25px]"
                onClick={() => setShowPassword(false)}
              />
            )}
          </div>
          {error && 
          <p className="text-red-500">{error}</p>
          }
          <button disabled={loading} onClick={handleSignUp} className="w-[70%] px-[20px] py-[10px] bg-black text-white font-semibold h-[50px] cursor-pointer rounded-2xl mt-[30px]">
           {loading ? <ClipLoader size={30} color="white"/>  : "Sign Up"}          </button>
          <p onClick={()=>navigate('/signin')} className="cursor-pointer text-[15px] text-gray-800 font-semibold">
            Already Have An Account ?{" "}
            <span className="border-b-2 border-b-black pb-[3px] text-black">
              Sign In
            </span>
          </p>
        </div>

        {/* right side logo container */}
        <div
          className="md:w-[50%] h-full hidden lg:flex justify-center items-center bg-[#000000] flex-col gap-[10px]
            text-white text-[16px] font-semibold rounded-l-[30px] shadow-2xl shadow-black"
        >
          <img src={logo2} alt="logo2" className="w-[40%]"/>
          <p>Not Just A Platform  , It's A VYBE </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
