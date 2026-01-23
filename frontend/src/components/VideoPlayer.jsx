import React, { useEffect, useRef, useState } from 'react';
import { FiVolume2, FiVolumeX } from 'react-icons/fi';

const VideoPlayer = ({ media }) => {
  const videoRef = useRef(null);
  const [mute, setMute] = useState(true);
  const [playing, setPlaying] = useState(false);

  const handleClick = () => {
    const video = videoRef.current;
    if (!video) return;

    if (playing) {
      video.pause();
      setPlaying(false);
    } else {
      video.play().catch(console.log);
      setPlaying(true);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video
            .play()
            .then(() => setPlaying(true))
            .catch(console.log);
        } else {
          video.pause();
          setPlaying(false);
        }
      },
      { threshold: 0.6 },
    );

    observer.observe(video);

    return () => {
      observer.unobserve(video);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="h-[100vh] w-full relative cursor-pointer overflow-hidden">
      <video
        ref={videoRef}
        src={media}
        loop
        muted={mute}
        onClick={handleClick}
        className="w-full object-cover object-center"
      />
      <div className="absolute bottom-2 right-2" onClick={() => setMute((prev) => !prev)}>
        {mute ? <FiVolumeX /> : <FiVolume2 />}
      </div>
    </div>
  );
};

export default VideoPlayer;
