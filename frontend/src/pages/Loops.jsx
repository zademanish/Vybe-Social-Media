import React, { useState } from 'react'
import { MdOutlineKeyboardBackspace } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import LoopCard from '../components/LoopCard'
import { useSelector } from 'react-redux'
import ErrorBoundary from '../components/ErrorBoundary'

const Loops = () => {
  const navigate = useNavigate()
  const {loopData} = useSelector(state=>state.loop)
  return (
    <div className='w-screen h-screen bg-gradient-to-bl from-[#4F5978] via-[#8765A6] to-[#B8BEB8] overflow-hidden flex justify-center items-center'>
         <div className="w-full h-[80px]  flex items-center gap-[20px] px-[20px] fixed top-[10px] left-[10px] z-100">
                <MdOutlineKeyboardBackspace
                  onClick={() => navigate(`/`)}
                  className="text-white  w-[25px] h-[25px] cursor-pointer"
                />
                <h1 className="text-white text-[20px] font-semibold">Loops</h1>
              </div>
              <div className='h-[100vh] overflow-y-scroll snap-y snap-mandatory scrollbar-hide'>
                <ErrorBoundary>
            {loopData?.map((loop,index)=>(
              <div key={index} className='h-screen snap-start'>

                <LoopCard loop={loop} />
              </div>
            ))}
                </ErrorBoundary>
              </div>
    </div>
  )
}

export default Loops