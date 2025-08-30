import { useEffect, useState } from "react";
import axios from "axios";
import { setUserData, clearUserData } from "../redux/slices/userSlice";
import { setCurrentUserStory } from "../redux/slices/storySlice";
import { useDispatch } from "react-redux";

export default function useCurrentUser() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true); // ✅ missing in your version

  useEffect(() => {
    const controller = new AbortController();

    axios
      .get(`${import.meta.env.VITE_SERVER_URL}/api/user/current`, {
        withCredentials: true,
        signal: controller.signal,
        responseType: "json",
      })
      .then((res) => {
        dispatch(setUserData(res.data));
        if (res.data?.story) {
          dispatch(setCurrentUserStory(res.data.story));
        }
      })
      .catch((err) => {
        if (axios.isCancel(err)) return;
        console.error("Error fetching current user:", err);
        dispatch(clearUserData());
      })
      .finally(() => {
        setLoading(false); // ✅ ensures flash signin is gone
      });

    return () => controller.abort();
  }, [dispatch]);

  return { loading }; // ✅ return loading so App.jsx can wait
}
