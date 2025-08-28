import React, { useEffect, useRef, useState } from "react";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import dp from "../assets/dp.webp";
import axios from "axios";
import { setUserData, setProfileData } from "../redux/slices/userSlice";
import { ClipLoader } from "react-spinners";
import { RxCross2 } from "react-icons/rx";

// ✅ Reusable Input Component
const InputField = ({ value, onChange, placeholder }) => (
  <input
    type="text"
    className="w-[90%] max-w-[600px] h-[60px] bg-white border-2 border-gray-700 
               rounded-2xl text-black font-semibold px-[20px] outline-none"
    placeholder={placeholder}
    value={value}
    onChange={(e) => onChange(e.target.value)}
  />
);

const EditProfile = () => {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const imageInput = useRef();

  // Profile fields
  const [form, setForm] = useState({
    name: "",
    userName: "",
    bio: "",
    profession: "",
    gender: "",
  });

  const [frontendImage, setFrontendImage] = useState(dp);
  const [backendImage, setBackendImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [removeImage, setRemoveImage] = useState(false);

  // ✅ Prefill data on mount
  useEffect(() => {
    if (userData) {
      setForm({
        name: userData.name || "",
        userName: userData.userName || "",
        bio: userData.bio || "",
        profession: userData.profession || "",
        gender: userData.gender || "",
      });
      setFrontendImage(userData.profileImage || dp);
      setRemoveImage(!!userData.profileImage);
    }
  }, [userData]);

  // ✅ Handle file change
  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
    setRemoveImage(true);

    // allow reselecting same image
    e.target.value = "";
  };

  // ✅ Remove image
  const handleRemoveImage = (e) => {
    e.stopPropagation();
    setRemoveImage(false);
    setFrontendImage(dp);
    setBackendImage(null);
    if (imageInput.current) imageInput.current.value = "";
  };

  // ✅ Submit form
  const handleEditProfile = async () => {
    if (!form.name.trim() || !form.userName.trim()) {
      alert("Name and Username cannot be empty.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));

      if (backendImage) {
        formData.append("profileImage", backendImage);
      }
      if (!backendImage && !removeImage) {
        formData.append("removeImage", true);
      }

      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/user/editProfile`,
        formData,
        { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }
      );

      dispatch(setProfileData(data));
      dispatch(setUserData(data));
      navigate(`/profile/${data.userName}`);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[100vh] bg-gradient-to-bl from-[#4F5978] via-[#8765A6] to-[#B8BEB8] flex items-center flex-col gap-[20px]">
      {/* Header */}
      <div className="w-full h-[80px] flex items-center gap-[20px] px-[20px]">
        <MdOutlineKeyboardBackspace
          onClick={() => navigate(`/profile/${userData.userName}`)}
          className="text-white w-[25px] h-[25px] cursor-pointer"
        />
        <h1 className="text-white text-[20px] font-semibold">Edit Profile</h1>
      </div>

      {/* Profile Image */}
      <div
        className="relative w-[80px] h-[80px] md:w-[100px] md:h-[100px] rounded-full 
                   border-2 border-white overflow-hidden cursor-pointer"
        onClick={() => imageInput.current.click()}
      >
        <input type="file" accept="image/*" ref={imageInput} hidden onChange={handleImage} />
        <img src={frontendImage} alt="Profile" className="w-full h-full object-cover" />
        {removeImage && (
          <RxCross2
            onClick={handleRemoveImage}
            className="w-[20px] h-[20px] text-white absolute top-2 right-2 bg-black/60 
                       rounded-full cursor-pointer hover:bg-red-600"
          />
        )}
      </div>

      {/* Change Picture Text */}
      <div
        className="text-black cursor-pointer text-center text-[18px] font-semibold"
        onClick={() => imageInput.current.click()}
      >
        Change Your Profile Picture
      </div>

      {/* Inputs */}
      <InputField value={form.name} onChange={(val) => setForm({ ...form, name: val })} placeholder="Enter Your Name" />
      <InputField value={form.userName} onChange={(val) => setForm({ ...form, userName: val })} placeholder="Enter Your Username" />
      <InputField value={form.bio} onChange={(val) => setForm({ ...form, bio: val })} placeholder="Bio" />
      <InputField value={form.profession} onChange={(val) => setForm({ ...form, profession: val })} placeholder="Profession" />
      <InputField value={form.gender} onChange={(val) => setForm({ ...form, gender: val })} placeholder="Gender" />

      {/* Save Button */}
      <button
        onClick={handleEditProfile}
        className="px-[10px] w-[60%] text-white max-w-[400px] py-[5px] h-[50px] bg-[linear-gradient(270deg,#ff0080,#ff8c00,#40e0d0,#8a2be2,#ff0080)] bg-[length:1000%_1000%] [animation:rainbow_8s_ease_infinite]  hover:shadow-[0_0_20px_#fff,0_0_40px_#fff] cursor-pointer 
                   rounded-2xl font-semibold flex justify-center items-center"
      >
        {loading ? <ClipLoader size={30} color="black" /> : "Save Profile"}
      </button>
    </div>
  );
};

export default EditProfile;
