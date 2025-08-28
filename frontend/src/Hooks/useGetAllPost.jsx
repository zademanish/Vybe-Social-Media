import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setPostData } from "../redux/slices/postSlice";


function useGetAllPost() {
    const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
   const fetchPost = async ()=>{
     try {
         const result = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/post/getAll`, { withCredentials: true })
         dispatch(setPostData(result.data))
     } catch (error) {
        console.log(error);
     }
   }
   fetchPost()
  }, [dispatch,userData]);
}

export default useGetAllPost