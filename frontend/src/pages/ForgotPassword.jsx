import React, { useState } from "react";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [inputClicked, setInputClicked] = useState({
    email: false,
    otp: false,
    newPassword: false,
    confirmNewPassword: false,
  });
  const [loading, SetLoading] = useState(false);
  const [email, setEmail] = useState("");
    const [msg, setMsg] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error,setError] = useState("")
  const navigate = useNavigate()

  const handleStep1 = async () => {
    SetLoading(true)
    setError("")
    try {
      const result = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/auth/sendOtp`,
        {email},
        { withCredentials: true }
      );
      setMsg(result.data.message)
      SetLoading(false)
      setStep(2)
    } catch (error) {
      console.log(error);
       setError(error.response?.data?.message)
       SetLoading(false)

    }
  };

  const handleStep2 = async () => {
        SetLoading(true)
        setError("")
    try {
      const result = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/auth/verifyOtp`,
        { email, otp },
        { withCredentials: true }
      );
      setMsg(result.data.message)
      SetLoading(false)
      setStep(3)
    } catch (error) {
  
       setError(error.response?.data?.message)
      SetLoading(false)

    }
  };

  const handleStep3 = async () => {
    if (newPassword !== confirmNewPassword) {
      return setError("Passwords Do not match");
    }
    SetLoading(true);
    setError("")
    try {

      const result = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/auth/resetPassword`,
        { email, password: newPassword },
        { withCredentials: true }
      );
      setMsg(result.data.message)
      SetLoading(false);
      navigate("/signin")

    } catch (error) {
      console.log(error);
       setError(error.response?.data?.message)
      SetLoading(false);
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-tr from-[#4F5978] via-[#8765A6] to-[#B8BEB8] flex flex-col justify-center items-center">
      {step == 1 && (
        <div className="w-[90%] max-w-[500px] h-[500px] bg-white rounded-2xl flex justify-center items-center flex-col border-[#1a1f23]">
           {msg && <h1 className="text-green-700 mb-5">{msg}</h1>}
          <h2 className="text-30px font-semibold">Forgot Password</h2>
          <div
            className="relative mt-[30px] flex items-center justify-start w-[90%] h-[50px] rounded-2xl border-2 border-black"
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
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
          </div>

             {error && 
          <p className="text-red-500 font-semibold text-[15px]">{error}</p>}

          <button
            disabled={loading}
            onClick={handleStep1}
            className="w-[70%] px-[20px] py-[10px] bg-black text-white font-semibold h-[50px] cursor-pointer rounded-2xl mt-[30px]"
          >
            {loading ? <ClipLoader size={30} color="white" /> : "Send OTP"}{" "}
          </button>
        </div>
      )}

      {step == 2 && (
        <div className="w-[90%] max-w-[500px] h-[500px] bg-white rounded-2xl flex justify-center items-center flex-col border-[#1a1f23]">
          {msg && <h1 className="text-green-700 mb-5">{msg}</h1>}
          <h2 className="text-30px font-semibold">Forgot Password</h2>
          <div
            className="relative mt-[30px] flex items-center justify-start w-[90%] h-[50px] rounded-2xl border-2 border-black"
            onClick={() => setInputClicked({ ...inputClicked, otp: true })}
          >
            <label
              htmlFor="otp"
              className={`text-gray-700 absolute left-[20px] px-[4px] font-bold bg-white text-[15px] ${
                inputClicked.otp ? "top-[-15px] py-[3px]" : ""
              }`}
            >
              Enter OTP{" "}
            </label>
            <input
              type="text"
              id="otp"
              className="w-[100%] h-[100%] rounded-2xl px-[20px] outline-none border-0 font-semibold"
              onChange={(e) => setOtp(e.target.value)}
              value={otp}
              required
            />
          </div>
             {error && 
          <p className="text-red-500 font-semibold text-[15px]">{error}</p>}

          <button
            disabled={loading}
             onClick={handleStep2}
            className="w-[70%] px-[20px] py-[10px] bg-black text-white font-semibold h-[50px] cursor-pointer rounded-2xl mt-[30px]"
          >
            {loading ? <ClipLoader size={30} color="white" /> : "Submit OTP"}{" "}
          </button>
        </div>
      )}
      {step == 3 && (
        <div className="w-[90%] max-w-[500px] h-[500px] bg-white rounded-2xl flex justify-center items-center flex-col border-[#1a1f23]">
          {msg && <h1 className="text-green-700 mb-5">{msg}</h1>}
          <h2 className="text-30px font-semibold">Reset Password</h2>
          <div
            className="relative mt-[30px] flex items-center justify-start w-[90%] h-[50px] rounded-2xl border-2 border-black"
            onClick={() =>
              setInputClicked({ ...inputClicked, newPassword: true })
            }
          >
            <label
              htmlFor="newPassword"
              className={`text-gray-700 absolute left-[20px] px-[4px] font-bold bg-white text-[15px] ${
                inputClicked.newPassword ? "top-[-15px] py-[3px]" : ""
              }`}
            >
              Enter New Password{" "}
            </label>
            <input
              type="text"
              id="newPassword"
              className="w-[100%] h-[100%] rounded-2xl px-[20px] outline-none border-0 font-semibold"
              onChange={(e) => setNewPassword(e.target.value)}
              value={newPassword}
              required
            />
          </div>
          <div
            className="relative mt-[30px] flex items-center justify-start w-[90%] h-[50px] rounded-2xl border-2 border-black"
            onClick={() =>
              setInputClicked({ ...inputClicked, confirmNewPassword: true })
            }
          >
            <label
              htmlFor="confirmNewPassword"
              className={`text-gray-700 absolute left-[20px] px-[4px] font-bold bg-white text-[14px] ${
                inputClicked.confirmNewPassword ? "top-[-15px] py-[3px]" : ""
              }`}
            >
              Confirm Password{" "}
            </label>
            <input
              type="password"
              id="confirmNewPassword"
              className="w-[100%] h-[100%] rounded-2xl px-[20px] outline-none border-0 font-semibold"
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              value={confirmNewPassword}
              required
            />
          </div>

             {error && 
          <p className="text-red-500 font-semibold text-[15px]">{error}</p>}

          <button
            disabled={loading}
             onClick={handleStep3}
            className="w-[70%] px-[20px] py-[10px] bg-black text-white font-semibold h-[50px] cursor-pointer rounded-2xl mt-[30px]"
          >
            {loading ? (
              <ClipLoader size={30} color="white" />
            ) : (
              "Reset Password"
            )}{" "}
          </button>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
