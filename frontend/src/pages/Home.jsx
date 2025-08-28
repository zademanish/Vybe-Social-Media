
import LeftHome from '../components/LeftHome'
import Feed from '../components/Feed'
import RightHome from '../components/RightHome'


const Home = () => {

  return (
    <div className='w-full flex justify-center items-center bg-gradient-to-bl from-[#4F5978] via-[#8765A6] to-[#B8BEB8]'>
        <LeftHome/>
        <Feed/>
        <RightHome/>
    </div>
  )
}

export default Home