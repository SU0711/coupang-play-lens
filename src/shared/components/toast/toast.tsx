// components/Toast.tsx

import React, { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  duration?: number; // 표시할 시간 (밀리초)
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [animation, setAnimation] = useState<'fadeIn' | 'fadeOut'>('fadeIn');

  useEffect(() => {
    // duration 시간 후에 fade out 애니메이션 시작
    const timer = setTimeout(() => {
      setAnimation('fadeOut');
    }, duration - 300); // fade out 시간 고려

    // 컴포넌트가 언마운트 될 때 타이머를 정리
    return () => {
      clearTimeout(timer);
    };
  }, [duration]);

  useEffect(() => {
    if (animation === 'fadeOut') {
      // fade out 애니메이션이 끝난 후 토스트를 숨김
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose();
      }, 300); // fade out 애니메이션 시간

      return () => clearTimeout(timer);
    }
  }, [animation, onClose]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed top-5 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white py-2 px-4 rounded shadow-lg z-50 transition-opacity duration-300 ${
        animation === 'fadeIn' ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {message}
    </div>
  );
};

export default Toast;
