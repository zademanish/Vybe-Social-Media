import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setFollowing } from "../redux/slices/userSlice";


function useGetFollowingList() {
    const { storyData } = useSelector((state) => state.story);
  const dispatch = useDispatch();
  useEffect(() => {
   const fetchUser = async ()=>{
     try {
         const result = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/user/followingList`, { withCredentials: true })
         dispatch(setFollowing(result.data))
     } catch (error) {
        console.log(error);
     }
   }
   fetchUser()
  }, [storyData]);
}

export default useGetFollowingList