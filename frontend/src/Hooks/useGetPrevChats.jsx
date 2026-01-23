import { useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setPrevChatUsers } from '../redux/slices/messageSlice';

function useGetPrevChats() {
  const dispatch = useDispatch();
  const { messages } = useSelector((state) => state.message);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/message/prevChats`, {
          withCredentials: true,
        });
        dispatch(setPrevChatUsers(result.data));
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, [messages, dispatch]);
}

export default useGetPrevChats;
