'use client';

import { useEffect, useRef, useState } from 'react';
import BookingButton from './BookingButton';
import MobileMenu from './MobileMenu';
import { navItems } from '@/data/navigation';
import { site } from '@/data/site';
import { scrollToSection, scrollToTop } from '@/lib/scroll';
import styles from './Header.module.css';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState(null);
  const progressRef = useRef(null);

  /* Компактное состояние шапки и полоса прогресса чтения. */
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Подсветка пункта меню, соответствующего видимой секции. */
  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.target))
      .filter(Boolean);
    if (!sections.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 1] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const go = (event, target) => {
    event.preventDefault();
    scrollToSection(target);
  };

  return (
    <header className={`${styles.header} ${scrolled ? styles.compact : ''}`}>
      <div className={styles.inner}>
        <a
          className={styles.logo}
          href="#top"
          aria-label={`${site.name} — на главную`}
          onClick={(e) => {
            e.preventDefault();
            scrollToTop();
          }}
        >
          {site.name}
        </a>

        <nav className={styles.nav} aria-label="Основная навигация">
          {navItems.map((item) => (
            <a
              key={item.target}
              href={`#${item.target}`}
              className={active === item.target ? styles.active : undefined}
              aria-current={active === item.target ? 'true' : undefined}
              onClick={(e) => go(e, item.target)}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className={styles.side}>
          <div className={styles.contact}>
            <a href={site.phoneHref}>{site.phone}</a>
            <a href={site.gis} target="_blank" rel="noreferrer">
              {site.addressShort}
            </a>
          </div>

          <BookingButton className={`pill pill--primary pill--sm ${styles.cta}`} />

          <button
            type="button"
            className={styles.burger}
            onClick={() => setMenuOpen(true)}
            aria-label="Открыть меню"
            aria-expanded={menuOpen}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      <span ref={progressRef} className={styles.progress} aria-hidden="true" />

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
