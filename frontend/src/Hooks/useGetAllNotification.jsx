import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setNotificationData } from "../redux/slices/userSlice";


function useGetAllNotification() {
    const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
   const fetchNotifications = async ()=>{
     try {
         const result = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/user/getAllNotifications`, { withCredentials: true })
         dispatch(setNotificationData(result.data))
     } catch (error) {
        console.log(error);
     }
   }
   fetchNotifications()
  }, [dispatch,userData]);
}

export default useGetAllNotification