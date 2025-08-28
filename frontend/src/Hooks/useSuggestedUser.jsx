import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setSuggestedUsers } from "../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";



export default function useSuggestedUser() {
  const dispatch = useDispatch();
const navigate = useNavigate();
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_SERVER_URL}/api/user/suggested`, { withCredentials: true })
      .then(res => {
        // Prevent storing HTML payloads
        if (typeof res.data === "string" && res.data.includes("<!DOCTYPE html>")) {
          console.error("Backend returned HTML instead of JSON:", res.data);
          return;
        }
        dispatch(setSuggestedUsers(res.data));
      })
      .catch(err => {
        console.error("Error fetching current user:", err);
        navigate("/signin")
      });
  }, [dispatch]);
}
