import React, { useEffect, useState } from 'react';
import { MdOutlineKeyboardBackspace } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import NotificationCard from '../components/NotificationCard';
import { setNotificationData } from '../redux/slices/userSlice';
import axios from 'axios';

const Notification = () => {
    const navigate = useNavigate();
    const { notificationData } = useSelector(state => state?.user);
    const dispatch = useDispatch();

    // Local state to manage loading status
    const [isLoading, setIsLoading] = useState(true); 

    // Derived IDs
    const ids = notificationData.map((n) => n._id);

    // Function to fetch all notifications and update Redux state
    const fetchNotifications = async () => {
        try {
            setIsLoading(true); // Start loading before API call
            const result = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/api/user/getAllNotifications`,
                { withCredentials: true }
            );
            dispatch(setNotificationData(result.data)); // Update Redux state
        } catch (error) {
            console.log('Error fetching notifications:', error);
        } finally {
            setIsLoading(false); // Stop loading
        }
    };

    // Function to mark a list of notifications as read on the server
    const markAsRead = async (notificationIds) => {
        if (notificationIds.length === 0) return; 
        try {
            await axios.post(
                `${import.meta.env.VITE_SERVER_URL}/api/user/markAsRead`,
                { notificationId: notificationIds },
                { withCredentials: true }
            );
        } catch (error) {
            console.log('Error marking as read:', error);
        }
    };

    // EFFECT 1: Fetch data every time the component renders (if it re-mounts)
    useEffect(() => {
        // This ensures fetchNotifications is called immediately upon component load
        fetchNotifications();
    }, []); // Runs only on mount

    // EFFECT 2: Run the markAsRead side-effect only after data is loaded and available
    useEffect(() => {
        // Only run if loading is finished AND we have notifications to mark
        if (!isLoading && ids.length > 0) {
            markAsRead(ids);
        }
    }, [isLoading, notificationData]); // Runs when loading finishes or data changes

    return (
        <div className='w-full h-[100vh] bg-gradient-to-bl from-[#4F5978] via-[#8765A6] to-[#B8BEB8] overflow-auto'>
            <div className="w-full h-[80px] flex items-center gap-[20px] px-[20px]">
                <MdOutlineKeyboardBackspace
                    onClick={() => navigate("/")}
                    className="text-white w-[25px] h-[25px] cursor-pointer lg:hidden"
                />
                <h1 className="text-white text-[20px] font-semibold">Notifications</h1>
            </div>

            <div className='w-full h-full flex flex-col gap-[20px] p-[20px]'> 
                
                {/* CONDITIONAL RENDERING */}
                {isLoading ? (
                    // Show loading while fetching data
                    <div className="text-center mt-20">
                        <p className="text-white text-lg">Loading Notifications...</p>
                    </div>
                ) : notificationData && notificationData.length > 0 ? (
                    // Show the list of notifications
                    notificationData.map((noti, index) => (
                        <NotificationCard noti={noti} key={index} />
                    ))
                ) : (
                    // Show a message if no notifications are found
                    <p className="text-white/80 text-center mt-10">No new notifications.</p>
                )}
            </div>
        </div>
    );
};

export default Notification;