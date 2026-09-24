'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';
import BookingButton from './BookingButton';
import { navItems } from '@/data/navigation';
import { site } from '@/data/site';
import { lockScroll, scrollToSection, unlockScroll } from '@/lib/scroll';
import styles from './MobileMenu.module.css';

export default function MobileMenu({ open, onClose }) {
  const rootRef = useRef(null);
  const onCloseRef = useRef(onClose);
  const [mounted, setMounted] = useState(false);

  onCloseRef.current = onClose;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return undefined;

    lockScroll();
    const onKey = (e) => {
      if (e.key === 'Escape') onCloseRef.current();
    };
    document.addEventListener('keydown', onKey);

    const ctx = gsap.context(() => {
      gsap.fromTo(rootRef.current, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'power2.out' });
      gsap.fromTo(
        rootRef.current.querySelectorAll('[data-anim]'),
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.06, delay: 0.06 },
      );
    }, rootRef);

    return () => {
      document.removeEventListener('keydown', onKey);
      ctx.revert();
      unlockScroll();
    };
  }, [open]);

  if (!mounted || !open) return null;

  const go = (event, target) => {
    event.preventDefault();
    onClose();
    requestAnimationFrame(() => scrollToSection(target));
  };

  /* Меню выносится в body: у шапки есть backdrop-filter, а он делает её
     содержащим блоком для position: fixed — внутри неё меню прижималось
     к шапке вместо полноэкранного слоя. */
  return createPortal(
    <div
      className={styles.root}
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label="Меню"
      data-lenis-prevent
    >
      <div className={styles.top}>
        <span className={styles.logo} data-anim>
          {site.name}
        </span>
        <button type="button" className={styles.close} onClick={onClose} aria-label="Закрыть меню">
          <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
            <path d="M2 2 L20 20 M20 2 L2 20" stroke="currentColor" strokeWidth="1.4" fill="none" />
          </svg>
        </button>
      </div>

      <nav className={styles.nav} aria-label="Мобильная навигация">
        {navItems.map((item) => (
          <a key={item.target} href={`#${item.target}`} onClick={(e) => go(e, item.target)} data-anim>
            {item.label}
          </a>
        ))}
      </nav>

      <div className={styles.contacts}>
        <a href={site.gis} target="_blank" rel="noreferrer" data-anim>
          {site.addressShort}
        </a>
        <a className={styles.phone} href={site.phoneHref} data-anim>
          {site.phone}
        </a>
      </div>

      <BookingButton className={`pill pill--primary ${styles.cta}`} data-anim />
    </div>,
    document.body,
  );
}
