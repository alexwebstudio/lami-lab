'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import BookingButton from './BookingButton';
import { scrollToSection } from '@/lib/scroll';
import heroModel from '../../public/images/hero-model.png';
import styles from './Hero.module.css';

export default function Hero() {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .from(`.${styles.photo}`, { opacity: 0, yPercent: 5, scale: 1.05, duration: 1.5 }, 0)
        .from(`.${styles.glow}`, { opacity: 0, scale: 0.85, duration: 1.8 }, 0)
        .from(`.${styles.titleLine}`, { yPercent: 108, duration: 1.15, stagger: 0.09 }, 0.2)
        .from(`.${styles.lead}`, { opacity: 0, y: 20, duration: 0.9 }, 0.5)
        .from(`.${styles.actions} > *`, { opacity: 0, y: 16, duration: 0.8, stagger: 0.09 }, 0.6)
        .from(`.${styles.marks} > *`, { opacity: 0, y: 14, duration: 0.8, stagger: 0.08 }, 0.75);

      /* Мягкий параллакс: модель и подсветка отстают от прокрутки. */
      gsap.to(`.${styles.photo}`, {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: 0.6 },
      });
      gsap.to(`.${styles.glow}`, {
        yPercent: -12,
        ease: 'none',
        scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: 0.8 },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.hero} ref={rootRef} id="top" aria-labelledby="hero-title">
      <span className={`glow ${styles.glow}`} aria-hidden="true" />

      {/* Линия изгиба ресницы — тихий фирменный акцент фона. */}
      <svg className={styles.curve} viewBox="0 0 900 420" fill="none" aria-hidden="true">
        <path
          d="M8 404C120 150 380 26 892 92"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <g strokeWidth="1.4" strokeLinecap="round" stroke="currentColor">
          <path d="M138 236 96 176" />
          <path d="M236 154 206 86" />
          <path d="M348 100 330 28" />
          <path d="M468 70 460 0" />
        </g>
      </svg>

      <div className={styles.photo}>
        <Image
          src={heroModel}
          alt="Мастер студии LAMI LAB — ламинирование ресниц и бровей в Караганде"
          priority
          sizes="(max-width: 900px) 78vw, 46vw"
          className={styles.photoImg}
        />
      </div>

      <div className={`inner ${styles.inner}`}>
        <div className={styles.left}>
          <h1 id="hero-title" className="display">
            <span className={styles.titleMask}>
              <span className={styles.titleLine}>Ламинирование</span>
            </span>{' '}
            <span className={styles.titleMask}>
              <span className={styles.titleLine}>ресниц и бровей</span>
            </span>{' '}
            <span className={styles.titleMask}>
              <span className={styles.titleLine}>в Караганде</span>
            </span>
          </h1>

          <p className={`lead ${styles.lead}`}>
            Естественный изгиб и аккуратная форма, которые держатся сами — выразительный взгляд
            без ежедневной укладки.
          </p>

          <div className={styles.actions}>
            <BookingButton className="pill pill--primary" />
            <a
              className="pill pill--outline"
              href="#services"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('services');
              }}
            >
              Услуги и цены
            </a>
          </div>

          <ul className={styles.marks}>
            <li>Ресницы — от 8 000 тг</li>
            <li>Брови — от 4 000 тг</li>
            <li>Комплекс — от 11 000 тг</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
