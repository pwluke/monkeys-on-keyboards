"use client";
import { useState, useEffect, useRef } from "react";

const VideoIntro = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Auto-play the video
    video.play().catch(console.error);

    // Set up timer to start fade after 5 seconds
    const fadeTimer = setTimeout(() => {
      setIsPlaying(false);
      // Start fade out
      video.style.transition = "opacity 1s ease-out";
      video.style.opacity = "0";
      
      // Complete fade and call onComplete after 1 second
      setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, 1000);
    }, 5000);

    return () => {
      clearTimeout(fadeTimer);
    };
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-transparent flex items-center justify-center">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        muted
        playsInline
        preload="auto"
      >
        <source src="/video_monkeys.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoIntro;
