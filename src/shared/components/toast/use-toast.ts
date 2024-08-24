import { useState, useCallback } from 'react';

interface ToastState {
  message: string;
  id: number;
}

const useToast = () => {
  const [toasts, setToasts] = useState<ToastState[]>([]);

  const addToast = useCallback((message: string, duration = 3000) => {
    const id = Date.now();
    setToasts((prevToasts) => [...prevToasts, { message, id }]);

    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, duration);
  }, []);

  return { toasts, addToast };
};

export default useToast;
