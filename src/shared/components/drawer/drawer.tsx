'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './styles.module.css';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'left' | 'right' | 'top' | 'bottom';
  children: React.ReactNode;
  open: boolean;
  onClose: () => void;
}

const Drawer = ({
  direction = 'right',
  children,
  open,
  onClose,
  ...other
}: Props) => {
  const [drawerRoot, setDrawerRoot] = useState<HTMLElement | null>(null); // 초기에는 null로 설정
  const bgRef = React.useRef<HTMLDivElement>(null);
  const drawerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 클라이언트에서만 document 접근
    setDrawerRoot(document.getElementById('drawer-root'));
  }, []);

  const onBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === bgRef.current) {
      drawerRef.current!.style.animation = `${
        styles[`${direction}Out`]
      } 0.2s ease forwards`;
      drawerRef.current!.onanimationend = () => onClose();
    }
  };

  const onkeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!open || !drawerRoot) return null; // drawerRoot가 설정되기 전까지 null 반환

  return createPortal(
    <div
      ref={bgRef}
      tabIndex={0}
      role="button"
      onKeyDown={onkeyDown}
      onClick={onBackgroundClick}
      className={styles.drawerContainer}
    >
      <div
        ref={drawerRef}
        className={`${styles.drawerBox} ${styles[direction]}`}
        {...other}
      >
        {children}
      </div>
    </div>,
    drawerRoot
  );
};

export default Drawer;
