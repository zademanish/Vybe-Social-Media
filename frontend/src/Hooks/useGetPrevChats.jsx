import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setFollowing } from "../redux/slices/userSlice";
import { setPrevChatUsers } from "../redux/slices/messageSlice";


function useGetPrevChats() {
    const { messages } = useSelector((state) => state.message);
  const dispatch = useDispatch();
  useEffect(() => {
   const fetchUser = async ()=>{
     try {
         const result = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/message/prevChats`, { withCredentials: true })
         dispatch(setPrevChatUsers(result.data))
     } catch (error) {
        console.log(error);
     }
   }
   fetchUser()
  }, [messages]);
}

export default useGetPrevChats