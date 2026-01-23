import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFollowing } from '../redux/slices/userSlice';

function useGetFollowingList() {
  const dispatch = useDispatch();
  const { storyData } = useSelector((state) => state.story);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/user/followingList`,
          { withCredentials: true },
        );
        dispatch(setFollowing(result.data));
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, [storyData, dispatch]);
}

export default useGetFollowingList;
