import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { MdOutlineKeyboardBackspace } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchData } from '../redux/slices/userSlice';
import dp from '../assets/dp.webp';

let debounceTimeout;

function Search() {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const { searchData } = useSelector(state => state.user);
  const dispatch = useDispatch();

  const handleSearch = useCallback(async (searchTerm) => {
    if (!searchTerm) {
      dispatch(setSearchData([]));
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/user/search?keyWord=${searchTerm}`,
        { withCredentials: true }
      );
      dispatch(setSearchData(response.data));
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => handleSearch(input), 500);
    return () => clearTimeout(debounceTimeout);
  }, [input, handleSearch]);

  return (
    <div className="w-full min-h-screen bg-gradient-to-bl from-[#4F5978] via-[#8765A6] to-[#B8BEB8] flex flex-col items-center pt-24 gap-4 md:gap-6">
      {/* Top Bar */}
      <div className="w-full h-20 flex items-center gap-4 px-5 fixed top-0 text-white shadow-md z-20">
        <MdOutlineKeyboardBackspace
          onClick={() => navigate("/")}
          className=" w-7 h-7 cursor-pointer hover:scale-110 transition"
        />
        <h1 className=" text-xl font-semibold">Search Users</h1>
      </div>

      {/* Search Input */}
      <div className="w-full flex justify-center">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="w-[90%] max-w-[700px] flex items-center px-4 py-2 bg-white rounded-full shadow-md border border-gray-200 focus-within:ring-2 focus-within:ring-blue-400 transition"
        >
          <FiSearch className="w-5 h-5 text-gray-400" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="Search users..."
            className="w-full ml-3 outline-none text-gray-700 text-base bg-transparent placeholder-gray-400"
          />
        </form>
      </div>

      {/* Search Results */}
      <div className="w-full flex flex-col items-center gap-3 mt-4">
        {input ? (
          loading ? (
            <div className="text-gray-600 text-lg mt-5">Searching...</div>
          ) : searchData?.length > 0 ? (
            searchData.map((user) => (
              <div
                key={user._id}
                className="w-[90%] sm:w-[80%] max-w-[700px] h-16 sm:h-20 bg-white rounded-xl flex items-center gap-4 px-4 shadow hover:shadow-lg transition cursor-pointer"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0">
                  <img
                    src={user.profileImage || dp}
                    alt={user.userName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-gray-900 font-semibold text-base sm:text-lg">
                    {user.userName}
                  </span>
                  <span className="text-gray-500 text-sm sm:text-base">
                    {user.name}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-white text-lg mt-5">No users found.</div>
          )
        ) : (
          <div className="text-white text-2xl mt-10">Start typing to search...</div>
        )}
      </div>
    </div>
  );
}

export default Search;
