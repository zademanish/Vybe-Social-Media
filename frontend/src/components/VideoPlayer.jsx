import React, { useEffect, useRef, useState } from "react";
import { FiVolume2, FiVolumeX } from "react-icons/fi";

const VideoPlayer = ({ media }) => {
  const videoRef = useRef(null);
  const [mute, setMute] = useState(true);
  const [playing, setPlaying] = useState(false);

  // Handle click to play/pause manually
  const handleClick = () => {
    if (!videoRef.current) return;

    if (playing) {
      videoRef.current.pause();
      setPlaying(false);
    } else {
      videoRef.current.play().catch((err) => {
        console.log("Play blocked:", err);
      });
      setPlaying(true);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const video = videoRef.current;
        if (!video) return;

        if (entry.isIntersecting) {
          // Play when in viewport
          video.play().then(() => setPlaying(true)).catch((err) => {
            console.log("Autoplay blocked:", err);
          });
        } else {
          // Pause when out of viewport
          video.pause();
          setPlaying(false);
        }
      },
      { threshold: 0.6 } // video should be 60% visible
    );

    if (videoRef.current) observer.observe(videoRef.current);

    return () => {
      if (videoRef.current) observer.unobserve(videoRef.current);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="h-full w-full relative cursor-pointer max-w-full overflow-hidden">
      <video
        ref={videoRef}
        src={media}
        loop
        muted={mute}
        onClick={handleClick}
        className="w-full md:max-h-[60%] object-cover"
      />
      <div
        className="absolute bottom-2 right-2 cursor-pointer"
        onClick={() => setMute((prev) => !prev)}
      >
        {mute ? (
          <FiVolumeX className="w-5 h-5 text-white" />
        ) : (
          <FiVolume2 className="w-5 h-5 text-white" />
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
