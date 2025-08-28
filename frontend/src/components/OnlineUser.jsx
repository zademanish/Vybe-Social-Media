import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setSelectedUser } from '../redux/slices/messageSlice'
import dp from '../assets/dp.webp';

const OnlineUser = ({user}) => {
    const navigate = useNavigate()
   const dispatch = useDispatch()

  return (
    <div className='w-[50px] h-[50px] flex gap-[20px] justify-start items-center relative'>
             <div className="w-[50px] h-[50px] rounded-full border-2 border-black overflow-hidden cursor-pointer" onClick={()=>{
                dispatch(setSelectedUser(user))
                navigate(`/messageArea`)
             }}>
                                 <img
                                   src={user?.profileImage || dp}
                                   alt="Profile"
                                   className="w-full h-full object-cover"
                                 />
                               </div>
                               <div className='w-[10px] h-[10px] bg-green-700 rounded-full absolute top-0 right-0'>
                               </div>
    </div>
  )
}

export default OnlineUser