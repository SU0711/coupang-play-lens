import { useState, useCallback, useRef } from 'react';

// Long press 훅에 사용할 옵션 타입 정의
interface LongPressOptions {
  delay?: number; // Long press가 발생하기까지 기다릴 시간 (밀리초)
  onStart?: (longPressing?: boolean) => void; // Long press가 시작될 때 호출되는 콜백
  onFinish?: (longPressing?: boolean) => void; // Long press가 끝날 때 호출되는 콜백
}

// Long press 훅 구현
const useLongPress = (
  onLongPress: (e?: any) => void,
  { delay = 300, onStart, onFinish }: LongPressOptions = {}
) => {
  const [longPressing, setLongPressing] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startLongPress = useCallback(
    (e?: any) => {
      if (onStart) onStart(longPressing); // Optional: long press 시작시 호출될 함수
      setLongPressing(true);
      timeoutRef.current = setTimeout(() => {
        onLongPress(e);
      }, delay);
    },
    [onLongPress, delay, onStart]
  );

  const stopLongPress = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (longPressing && onFinish) onFinish(longPressing); // Optional: long press 종료시 호출될 함수
    setLongPressing(false);
  }, [longPressing, onFinish]);

  const handleMouseDown = useCallback(
    (e?: any) => {
      startLongPress(e);
    },
    [startLongPress]
  );

  const handleMouseUp = useCallback(() => {
    stopLongPress();
  }, [stopLongPress]);

  const handleMouseLeave = useCallback(() => {
    stopLongPress();
  }, [stopLongPress]);

  const handleTouchStart = useCallback(
    (e?: any) => {
      startLongPress(e);
    },
    [startLongPress]
  );

  const handleTouchEnd = useCallback(() => {
    stopLongPress();
  }, [stopLongPress]);

  return {
    onMouseDown: handleMouseDown,
    onMouseUp: handleMouseUp,
    onMouseLeave: handleMouseLeave,
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
  };
};

export default useLongPress;
