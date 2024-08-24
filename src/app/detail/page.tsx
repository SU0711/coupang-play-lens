'use client'

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

const VideoPlayerPage: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [previewPosition, setPreviewPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.addEventListener('timeupdate', handleTimeUpdate);
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
    }
    return () => {
      if (video) {
        video.removeEventListener('timeupdate', handleTimeUpdate);
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      }
    };
  }, []);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const seekTime = (e.nativeEvent.offsetX / e.currentTarget.clientWidth) * duration;
      videoRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleLongPress = (e: React.MouseEvent<HTMLVideoElement> | React.TouchEvent<HTMLVideoElement>) => {
    e.preventDefault();
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);

      const rect = videoRef.current.getBoundingClientRect();
      const x = 'clientX' in e ? e.clientX - rect.left : e.touches[0].clientX - rect.left;
      const y = 'clientY' in e ? e.clientY - rect.top : e.touches[0].clientY - rect.top;

      setPreviewPosition({ x, y });
      setShowPreview(true);

      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx && videoRef.current) {
          ctx.drawImage(
            videoRef.current,
            x - 150, y - 150, 300, 300,
            0, 0, 300, 300
          );
        }
      }
    }
  };

  const handleTouchEnd = () => {
    setShowPreview(false);
  };

  return (
    <div className="bg-black text-white min-h-screen flex flex-col">
      <div className="relative flex-grow">
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          src={"https://youtu.be/nN_vcm07bbk?si=OhR7YQBoxButv8zB"}
          onTouchStart={handleLongPress}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleLongPress}
          onMouseUp={handleTouchEnd}
        />
        {showPreview && (
          <div
            className="absolute bg-white p-1"
            style={{
              left: `${previewPosition.x}px`,
              top: `${previewPosition.y}px`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <canvas ref={canvasRef} width={300} height={300} />
          </div>
        )}
      </div>
      <div className="p-4 bg-gray-900">
        <div className="flex items-center justify-between mb-2">
          <button onClick={togglePlay} className="text-2xl">
            {isPlaying ? <Pause /> : <Play />}
          </button>
          <div className="flex items-center space-x-2">
            <SkipBack className="cursor-pointer" onClick={() => {
              if (videoRef.current) videoRef.current.currentTime -= 10;
            }} />
            <SkipForward className="cursor-pointer" onClick={() => {
              if (videoRef.current) videoRef.current.currentTime += 10;
            }} />
          </div>
        </div>
        <div
          className="bg-gray-700 h-1 cursor-pointer"
          onClick={handleSeek}
        >
          <div
            className="bg-red-600 h-full"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-sm mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerPage;
