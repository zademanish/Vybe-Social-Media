import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setPostData } from "../redux/slices/postSlice";
import { setStoryList } from "../redux/slices/storySlice";


function useGetAllStories() {
    const { userData } = useSelector((state) => state.user);
      const { storyData } = useSelector((state) => state.story);
  const dispatch = useDispatch();
  useEffect(() => {
   const fetchStories = async ()=>{
     try {
         const result = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/story/getAll`, { withCredentials: true })
         dispatch(setStoryList(result.data))
     } catch (error) {
        console.log(error);
     }
   }
   fetchStories()
  }, [dispatch,userData,storyData]);
}

export default useGetAllStories