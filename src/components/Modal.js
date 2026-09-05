'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { lockScroll, unlockScroll } from '@/lib/scroll';
import styles from './Modal.module.css';

const CLOSE_MS = 220;

export default function Modal({ open, onClose, labelledBy, size = 'default', children }) {
  const [mounted, setMounted] = useState(false);
  const [closing, setClosing] = useState(false);
  const panelRef = useRef(null);
  const timerRef = useRef(null);
  const onCloseRef = useRef(onClose);

  onCloseRef.current = onClose;

  useEffect(() => setMounted(true), []);

  // Стабильная ссылка: закрытие не зависит от перерисовок родителя.
  const close = useCallback(() => {
    if (timerRef.current) return;
    setClosing(true);
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      setClosing(false);
      onCloseRef.current();
    }, CLOSE_MS);
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    lockScroll();
    const onKey = (e) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    panelRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', onKey);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      setClosing(false);
      unlockScroll();
    };
  }, [open, close]);

  if (!mounted || !open) return null;

  return createPortal(
    <div className={`${styles.root} ${closing ? styles.closing : ''}`} role="presentation">
      <div className={styles.backdrop} onClick={close} />
      <div
        ref={panelRef}
        className={`${styles.panel} ${size === 'wide' ? styles.panelWide : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
      >
        <button type="button" className={styles.close} onClick={close} aria-label="Закрыть">
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <path d="M1 1 L17 17 M17 1 L1 17" stroke="currentColor" strokeWidth="1.5" fill="none" />
          </svg>
        </button>
        {children}
      </div>
    </div>,
    document.body,
  );
}
