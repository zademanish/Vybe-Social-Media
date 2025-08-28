import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setLoopData } from "../redux/slices/loopSlice";


function useGetAllLoops() {
    const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
   const fetchLoops = async ()=>{
     try {
         const result = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/loop/getAll`, { withCredentials: true })
         dispatch(setLoopData(result.data))
     } catch (error) {
        console.log(error);
     }
   }
   fetchLoops()
  }, [dispatch,userData]);
}

export default useGetAllLoops