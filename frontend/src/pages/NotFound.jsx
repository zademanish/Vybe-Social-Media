import React from 'react'
import { MdOutlineKeyboardBackspace } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'

const NotFound = () => {
    const navigate = useNavigate()
  return (
    <div className='w-full h-screen bg-gradient-to-bl from-[#4F5978] via-[#8765A6] to-[#B8BEB8] flex justify-center items-center '>
          <div className="absolute left-5 top-5 flex items-center gap-[10px]">
                <MdOutlineKeyboardBackspace
                  onClick={() => navigate('/')}
                  className="text-white w-7 h-7 cursor-pointer "
                />
                <h1 className=" text-white font-bold text-lg md:text-xl">Back</h1>
              </div>
        <div className='w-[400px] h-[150px] bg-white rounded-2xl flex justify-center items-center'>
        <h1 className='text-2xl font-bold text-black'>Page Not Found</h1>
        </div>
    </div>
  )
}

export default NotFound