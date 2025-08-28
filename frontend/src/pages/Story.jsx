import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { setStoryData } from '../redux/slices/storySlice'
import StoryCard from '../components/StoryCard'

const Story = () => {
  const {userName} = useParams()
  const dispatch = useDispatch()
  const { storyData } = useSelector((state) => state.story);

  const handleStory = async ()=>{
     dispatch(setStoryData(null))
    try {
      const result = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/story/getByUserName/${userName}`,{withCredentials:true})
      dispatch(setStoryData(result.data[0]))
    } catch (error) {
      console.log(error);   
    }
  }
  useEffect(()=>{
    if(userName){
      handleStory()
    }
  },[userName])
  return (
    <div className='w-full h-[100vh] bg-gradient-to-bl from-[#4F5978] via-[#8765A6] to-[#B8BEB8] flex justify-center items-center'>
      <StoryCard storyData={storyData}/>
    </div>
  )
}

export default Story