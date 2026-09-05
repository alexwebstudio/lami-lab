'use client';

import { useEffect, useRef, useState } from 'react';
import BookingButton from './BookingButton';
import { site } from '@/data/site';
import { PhoneIcon } from './icons';
import styles from './StickyCta.module.css';

/**
 * Мобильная панель действий. Появляется после Hero и прячется у подвала,
 * чтобы кнопка записи всегда была под рукой и не перекрывала контакты.
 */
export default function StickyCta() {
  const [visible, setVisible] = useState(false);
  const frame = useRef(0);

  useEffect(() => {
    const update = () => {
      frame.current = 0;
      const hero = document.getElementById('top');
      const footer = document.querySelector('footer');
      if (!hero || !footer) return;

      const pastHero = hero.getBoundingClientRect().bottom < 0;
      const nearEnd = footer.getBoundingClientRect().top < window.innerHeight;
      setVisible(pastHero && !nearEnd);
    };

    const onScroll = () => {
      if (frame.current) return;
      frame.current = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div className={`${styles.bar} ${visible ? styles.visible : ''}`} aria-hidden={!visible}>
      <a className={styles.call} href={site.phoneHref} tabIndex={visible ? 0 : -1}>
        <PhoneIcon />
        <span className="visually-hidden">Позвонить {site.phone}</span>
        <span aria-hidden="true">Позвонить</span>
      </a>
      <BookingButton className={`pill pill--primary ${styles.book}`} tabIndex={visible ? 0 : -1} />
    </div>
  );
}
