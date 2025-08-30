import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { setProfileData, setUserData } from "../redux/slices/userSlice";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import dp from "../assets/dp.webp";
import Nav from "../components/Nav";
import FollowButton from "../components/FollowButton";
import Post from "../components/Post";
import { setSelectedUser } from "../redux/slices/messageSlice";
import ProfilePost from "../components/ProfilePost";

const Profile = () => {
  const { userName } = useParams();
  const navigate = useNavigate();
  const [postType, setPostType] = useState("posts");
  const dispatch = useDispatch();
  const { profileData, userData } = useSelector((state) => state.user);
  const { postData } = useSelector((state) => state.post);

  const handleProfile = async () => {
    try {
      const result = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/user/getProfile/${userName}`,
        { withCredentials: true }
      );
      dispatch(setProfileData(result.data));
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogOut = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/auth/signout`, {
        withCredentials: true,
      });
      dispatch(setUserData(null));
      navigate("/signin");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    handleProfile();
  }, [userName, dispatch]);

  return (
    <div className="min-h-screen w-full overflow-auto bg-gradient-to-bl from-[#4F5978] via-[#8765A6] to-[#B8BEB8] grid grid-row-1 gap-4">
      <div className="w-full  px-3 sm:px-6 md:px-10 lg:px-16">
        {/* Header */}
        <div className="w-full h-[70px] sm:h-[80px] flex justify-between items-center text-white">
          <div onClick={() => navigate("/")}>
            <MdOutlineKeyboardBackspace className="text-white w-6 h-6 sm:w-[25px] sm:h-[25px] cursor-pointer" />
          </div>
          <div className="font-semibold text-lg sm:text-xl md:text-2xl">
            {profileData?.userName}
          </div>
          <div
            className="font-semibold cursor-pointer text-sm sm:text-lg underline"
            onClick={handleLogOut}
          >
            Log out
          </div>
        </div>

        {/* Profile info */}
        <div className="w-full flex justify-center items-center gap-5 sm:gap-10 mt-4">
          <div className="w-24 h-24 sm:w-36 sm:h-36 rounded-full border-2 border-white overflow-hidden">
            <img
              src={profileData?.profileImage || dp}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-center sm:text-left">
            <div className="font-bold text-xl sm:text-2xl text-white">
              {profileData?.name}
            </div>
            <div className="text-base sm:text-lg text-white font-semibold">
              {profileData?.profession || "New User"}
            </div>
            <div className="text-sm sm:text-base text-white mt-1">
              {profileData?.bio}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="w-full flex justify-center items-center gap-10 md:gap-20 mt-6">
          {/* Posts */}
          <div className="text-center">
            <div className="text-white text-2xl font-semibold">
              {profileData?.posts?.length}
            </div>
            <div className="text-lg text-white">Posts</div>
          </div>

          {/* Followers */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-3">
              <div className="flex relative">
                {profileData?.followers?.slice(0, 3).map((user, index) => (
                  <div
                    key={index}
                    className={`w-10 h-10 rounded-full border-2 border-black overflow-hidden cursor-pointer ${
                      index > 0 ? `-ml-3` : ""
                    }`}
                  >
                    <img
                      src={user?.profileImage || dp}
                      alt="Follower"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="text-white text-xl font-semibold">
                {profileData?.followers?.length}
              </div>
            </div>
            <div className="text-lg text-white">Followers</div>
          </div>

          {/* Following */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-3">
              <div className="flex relative">
                {profileData?.following?.slice(0, 3).map((user, index) => (
                  <div
                    key={index}
                    className={`w-10 h-10 rounded-full border-2 border-black overflow-hidden cursor-pointer ${
                      index > 0 ? `-ml-3` : ""
                    }`}
                  >
                    <img
                      src={user?.profileImage || dp}
                      alt="Following"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="text-white text-xl font-semibold">
                {profileData?.following?.length}
              </div>
            </div>
            <div className="text-lg text-white">Following</div>
          </div>
        </div>

        {/* Buttons */}
        <div className="w-full flex flex-wrap items-center justify-center gap-3 mt-6">
          {profileData?._id === userData?._id ? (
            <button
              className="px-4 sm:px-6 py-2 text-white text-base sm:text-lg rounded-md cursor-pointer bg-[linear-gradient(270deg,#ff0080,#ff8c00,#40e0d0,#8a2be2,#ff0080)] bg-[length:1000%_1000%] [animation:rainbow_8s_ease_infinite] hover:shadow-[0_0_20px_#fff,0_0_40px_#fff]"
              onClick={() => navigate("/editprofile")}
            >
              Edit Profile
            </button>
          ) : (
            <>
              <FollowButton
                onFollowChange={handleProfile}
                tailwind="px-4 sm:px-6 py-2 bg-white border cursor-pointer rounded-2xl text-sm sm:text-base"
                targetUserId={profileData?._id}
              />
              <button
                onClick={() => {
                  dispatch(setSelectedUser(profileData));
                  navigate("/messageArea");
                }}
                className="px-4 sm:px-6 py-2 bg-white border cursor-pointer rounded-2xl text-sm sm:text-base"
              >
                Message
              </button>
            </>
          )}
        </div>

        {/* Post/Saved Tabs */}
        {profileData?._id === userData?._id && (
          <div className="w-full max-w-[500px] h-14 sm:h-16 mx-auto mt-8 flex justify-around items-center rounded-full bg-transparent">
            <div
              className={`${
                postType === "posts"
                  ? "bg-black text-white shadow-lg"
                  : "hover:bg-white hover:text-black"
              } flex-1 mx-2 h-full flex justify-center items-center text-sm sm:text-lg font-semibold rounded-full cursor-pointer`}
              onClick={() => setPostType("posts")}
            >
              Posts
            </div>
            <div
              className={`${
                postType === "saved"
                  ? "bg-black text-white shadow-lg"
                  : "hover:bg-white hover:text-black"
              } flex-1 mx-2 h-full flex justify-center items-center text-sm sm:text-lg font-semibold rounded-full cursor-pointer`}
              onClick={() => setPostType("saved")}
            >
              Saved
            </div>
            <Nav />
          </div>
        )}
      </div>


        {/* Posts Section */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 place-content-center pb-[120px] px-4 gap-4">
          {profileData?._id === userData?._id ? (
            <>
              {postType === "posts" &&
                postData.map(
                  (post, index) =>
                    post.author?._id === profileData?._id && (
                      <ProfilePost post={post} key={index} />
                    )
                )}
              {postType === "saved" &&
                postData.map(
                  (post, index) =>
                    userData.saved.includes(post._id) && (
                      <ProfilePost post={post} key={index} />
                    )
                )}
            </>
          ) : (
            postData.map(
              (post, index) =>
                post.author?._id === profileData?._id && (
                  <ProfilePost post={post} key={index} />
                )
            )
          )}
        </div>
    </div>
  );
};

export default Profile;
