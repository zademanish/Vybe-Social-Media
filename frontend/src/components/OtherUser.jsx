import React from 'react'
import { useSelector } from 'react-redux'
import dp from '../assets/dp.webp';
import { useNavigate } from 'react-router-dom';
import FollowButton from './FollowButton';


const OtherUser = ({user}) => {
    const {userData} = useSelector(state=>state.user)
    const navigate = useNavigate()
  return (
    <div className='w-full h-[70px] flex items-center justify-between px-[10px]'>
             <div className="flex items-center gap-3">
                   <div className="w-[60px] h-[60px] rounded-full border-2 border-black overflow-hidden cursor-pointer" onClick={()=>navigate(`/profile/${user.userName}`)}>
                     <img
                       src={user?.profileImage || dp}
                       alt="Profile"
                       className="w-full h-full object-cover"
                     />
                   </div>
         
                   <div>
                     <div className="text-white text-[18px] font-semibold">
                       {user?.userName || 'Guest'}
                     </div>
                     <div className="text-white/60 text-[14px] font-semibold">
                       {user?.name || ''}
                     </div>
                   </div>
                 </div>
                 <FollowButton className="btn.rainbow" tailwind={'px-[10px] w-[100px] py-[5px] h-[40px]  text-white  bg-[linear-gradient(270deg,#ff0080,#ff8c00,#40e0d0,#8a2be2,#ff0080)] bg-[length:1000%_1000%] [animation:rainbow_8s_ease_infinite]  hover:shadow-[0_0_20px_#fff,0_0_40px_#fff]  rounded-lg cursor-pointer '} targetUserId={user._id}/>
        
    </div>
  )
}

export default OtherUser