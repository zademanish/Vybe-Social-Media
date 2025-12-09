import React, { useEffect } from 'react'
import { MdOutlineKeyboardBackspace } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import NotificationCard from '../components/NotificationCard'
import { setNotificationData } from '../redux/slices/userSlice'
import axios from 'axios'

const Notification = () => {
    const navigate = useNavigate()
    const {notificationData} = useSelector(state=>state?.user)
    const dispatch = useDispatch()

    const ids= notificationData.map((n)=>n._id)

    const markAsRead = async()=>{
      try {
        const result = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/user/markAsRead`,{notificationId:ids},{withCredentials:true})
        await fetchNotifications()
      } catch (error) {
        console.log(error)
        
      }
    }

    const fetchNotifications = async ()=>{
     try {
         const result = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/user/getAllNotifications`, { withCredentials: true })
         dispatch(setNotificationData(result.data))
     } catch (error) {
        console.log(error);
     }
   }


    useEffect(()=>{
      markAsRead()
    },[])
  return (
    <div className='w-full  h-[100vh] bg-gradient-to-bl from-[#4F5978] via-[#8765A6] to-[#B8BEB8] overflow-auto'>
               <div className="w-full h-[80px]  flex items-center gap-[20px] px-[20px] ">
                    <MdOutlineKeyboardBackspace
                      onClick={() => navigate("/")}
                      className="text-white w-[25px] h-[25px] cursor-pointer lg:hidden"
                    />
                    <h1 className="text-white text-[20px] font-semibold">Notifications</h1>
                  </div>
                  <div className='w-full h-[100%] flex flex-col gap-[20px]'> 
                    {notificationData && notificationData?.map((noti,index)=>(
                        <NotificationCard noti={noti} key={index}/>
                    ))}
                  </div>
    </div>
  )
}

export default Notification