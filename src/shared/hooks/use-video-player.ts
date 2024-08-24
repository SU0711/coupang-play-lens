// useVideoPlayer.ts

import { useRef, useState, useEffect } from 'react';
import ReactPlayer from 'react-player';

export const useVideoPlayer = (handleLongPress: Function) => {
  const videoRef = useRef<ReactPlayer | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [previewPosition, setPreviewPosition] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [productUrl, setProductUrl] = useState<string | null>(null);

  useEffect(() => {
    const player = videoRef.current?.getInternalPlayer() as HTMLVideoElement;
    if (player) {
      player.addEventListener('timeupdate', handleTimeUpdate);
      player.addEventListener('loadedmetadata', handleLoadedMetadata);
    }
    return () => {
      if (player) {
        player.removeEventListener('timeupdate', handleTimeUpdate);
        player.removeEventListener('loadedmetadata', handleLoadedMetadata);
      }
    };
  }, []);

  const handleTimeUpdate = () => {
    const player = videoRef.current?.getInternalPlayer() as HTMLVideoElement;
    if (player) {
      setCurrentTime(player.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    const player = videoRef.current?.getInternalPlayer() as HTMLVideoElement;
    if (player) {
      setDuration(player.duration);
    }
  };

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const seekTime =
        (e.nativeEvent.offsetX / e.currentTarget.clientWidth) * duration;
      videoRef.current.seekTo(seekTime);
      setCurrentTime(seekTime);
    }
  };

  return {
    videoRef,
    canvasRef,
    isPlaying,
    togglePlay,
    currentTime,
    setCurrentTime,
    duration,
    showPreview,
    setShowPreview,
    previewPosition,
    setPreviewPosition,
    handleSeek,
    isProcessing,
    productUrl,
  };
};
