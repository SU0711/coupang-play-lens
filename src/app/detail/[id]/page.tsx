'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, ChevronLeft } from 'lucide-react';
import useLongPress from '@/shared/hooks/use-long-press';
import ReactPlayer from 'react-player';
import axios from 'axios';
import Products from './products';
import { Drawer } from '@/shared/components/drawer';
import { useRouter } from 'next/navigation';
import { Toast, useToast } from '@/shared/components/toast';

const blobToFile = (blob: Blob, fileName: string): File => {
  return new File([blob], fileName, {
    type: blob.type,
    lastModified: Date.now(),
  });
};

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

const VideoPlayerPage = ({ params }: Props) => {
  const videoId = params.id;

  const videoRef = useRef<ReactPlayer | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  const [products, setProducts] = React.useState<any>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSimilar, setIsSimilar] = useState<boolean>(false);

  const { toasts, addToast } = useToast();

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
    if (videoRef.current) {
      setIsPlaying((prev) => !prev);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const seekTime =
        (e.nativeEvent.offsetX / e.currentTarget.clientWidth) * duration;
      videoRef.current.seekTo(seekTime);
      setCurrentTime(seekTime);
    }
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleLongPress = async (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    e.preventDefault();
    const player = videoRef.current?.getInternalPlayer() as HTMLVideoElement;
    if (player) {
      player.pause();
      setIsPlaying(false);

      const rect = player.getBoundingClientRect();
      let x = 0,
        y = 0;

      if (e.type === 'mousedown' || e.type === 'mouseup') {
        const mouseEvent = e as React.MouseEvent<HTMLDivElement>;
        x = mouseEvent.clientX - rect.left;
        y = mouseEvent.clientY - rect.top;
      } else if (e.type === 'touchstart' || e.type === 'touchend') {
        const touchEvent = e as React.TouchEvent<HTMLDivElement>;
        x = touchEvent.touches[0].clientX - rect.left;
        y = touchEvent.touches[0].clientY - rect.top;
      }

      // 메모리 내에서 캔버스 생성
      const canvas = document.createElement('canvas');
      canvas.width = 300;
      canvas.height = 300;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        const sx = (x / rect.width) * player.videoWidth - 150;
        const sy = (y / rect.height) * player.videoHeight - 150;
        const sWidth = 300;
        const sHeight = 300;

        ctx.drawImage(player, sx, sy, sWidth, sHeight, 0, 0, 300, 300);

        canvas.toBlob(async (blob) => {
          if (blob) {
            const file = blobToFile(blob, 'thumbnail.png');
            const formData = new FormData();
            formData.append('file', file);

            setIsProcessing(true);

            try {
              const domain = new URL(window.location.href).origin;
              // 파일 업로드 후 레이블 가져오기
              const res1 = await axios.post(
                `${domain}/api/get-label`,
                formData
              );
              const label = res1.data.label;

              setIsSimilar(!!res1.data?.isSimilar);

              // 레이블을 사용하여 제품 가져오기
              const res2 = await axios.get(`${domain}/api/products?q=${label}`);
              setProducts(res2.data);
            } catch (err) {
              addToast('일치하는 상품이 없습니다.');
              console.error(
                'Error during file upload or fetching products:',
                err
              );
            } finally {
              setIsProcessing(false);
            }
          } else {
            console.error('Blob is null, cannot create file.');
          }
        });
      }
    }
  };

  const longPressEventHandlers = useLongPress(handleLongPress, {
    delay: 300,
    onStart: (longPressing) => {
      if (longPressing) {
        setIsPlaying(false);
      } else {
        setIsPlaying((p) => !p);
      }
    },
    onFinish: () => console.log('Long press finished'),
  });

  const { back } = useRouter();

  const onBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    back();
  };

  return (
    <>
      <div className="bg-black text-white min-h-screen flex flex-col">
        <button className="fixed top-4 left-4 z-50" onClick={onBack}>
          <ChevronLeft size={32} />
        </button>
        <div className="flex-grow flex items-center">
          <ReactPlayer
            ref={videoRef}
            className="w-full h-full object-contain"
            url={`/videos/video${videoId}.mp4`}
            playing={isPlaying}
            onProgress={({ playedSeconds }) => setCurrentTime(playedSeconds)}
            width="100%"
            height="100%"
            {...longPressEventHandlers}
          />
        </div>
        <div className="fixed bottom-0 left-0 w-full p-4 bg-gray-900">
          <div className="flex items-center justify-between mb-2">
            <button onClick={togglePlay} className="text-2xl">
              {isPlaying ? <Pause /> : <Play />}
            </button>
            <div className="flex items-center space-x-2">
              <SkipBack
                className="cursor-pointer"
                onClick={() => {
                  if (videoRef.current)
                    videoRef.current.seekTo(currentTime - 10);
                }}
              />
              <SkipForward
                className="cursor-pointer"
                onClick={() => {
                  if (videoRef.current)
                    videoRef.current.seekTo(currentTime + 10);
                }}
              />
            </div>
          </div>
          <div className="bg-gray-700 h-1 cursor-pointer" onClick={handleSeek}>
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
        <div className="absolute">
          {isProcessing && (
            <div className="text-xl fixed top-4 right-4 text-gray-200">
              상품 조회 중..
            </div>
          )}
          <Drawer open={!!products.length} onClose={() => setProducts([])}>
            <Products products={products} isSimilar={isSimilar} />
          </Drawer>
        </div>
      </div>
      {toasts.map((toast) => (
        <Toast key={toast.id} message={toast.message} onClose={() => {}} />
      ))}
    </>
  );
};

export default VideoPlayerPage;
