'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Reveal from './Reveal';
import SectionHead from './SectionHead';
import { works } from '@/data/works';
import styles from './Works.module.css';

const pad = (n) => String(n).padStart(2, '0');

function Arrow({ direction }) {
  const d = direction === 'prev' ? 'M19 8H1M8 1L1 8L8 15' : 'M1 8h18M12 1l7 7-7 7';
  return (
    <svg width="20" height="16" viewBox="0 0 20 16" fill="none" aria-hidden="true">
      <path d={d} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const AUTOPLAY_MS = 5000;

export default function Works() {
  const [index, setIndex] = useState(0);
  const [inView, setInView] = useState(false);
  const [restart, setRestart] = useState(0);
  const directionRef = useRef(1);
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const pointerRef = useRef(null);
  const isFirst = useRef(true);

  const slide = works[index];

  /* Ручное переключение сбрасывает таймер автопоказа. */
  const move = useCallback((step) => {
    directionRef.current = step;
    setIndex((current) => (current + step + works.length) % works.length);
    setRestart((value) => value + 1);
  }, []);

  const goTo = useCallback((next) => {
    setIndex((current) => {
      if (next === current) return current;
      directionRef.current = next > current ? 1 : -1;
      return next;
    });
    setRestart((value) => value + 1);
  }, []);

  /* Автопоказ включается, когда секция появляется на экране. */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.35 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  /* Один таймер за раз: смена зависимостей гасит предыдущий интервал. */
  useEffect(() => {
    if (!inView) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const timer = window.setInterval(() => {
      directionRef.current = 1;
      setIndex((current) => (current + 1) % works.length);
    }, AUTOPLAY_MS);

    return () => window.clearInterval(timer);
  }, [inView, restart]);

  /* Переход между работами: изображения и подпись въезжают по направлению листания. */
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;
    if (isFirst.current) {
      isFirst.current = false;
      return undefined;
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const parts = stage.querySelectorAll('[data-slide-part]');
    /* На мобильных — только проявление: сдвиг выводил кадры за пределы
       своих контейнеров и они наезжали друг на друга и на стрелки. */
    const compact = window.matchMedia('(max-width: 900px)').matches;
    const from = compact ? 0 : directionRef.current > 0 ? 56 : -56;

    gsap.killTweensOf(parts);
    const tween = gsap.fromTo(
      parts,
      { opacity: 0, x: from, scale: compact ? 1 : 1.02 },
      {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: compact ? 0.5 : 0.85,
        ease: 'power3.out',
        stagger: compact ? 0.04 : 0.07,
      },
    );

    return () => {
      tween.kill();
      gsap.set(parts, { clearProps: 'opacity,transform' });
    };
  }, [index]);

  /* Лёгкий параллакс крупного кадра при прокрутке — только на широких экранах:
     на мобильных сдвиг ломал компоновку соседних кадров. */
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    if (window.matchMedia('(max-width: 900px)').matches) return undefined;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        `.${styles.featured}`,
        { y: 28 },
        {
          y: -28,
          ease: 'none',
          scrollTrigger: { trigger: stage, start: 'top bottom', end: 'bottom top', scrub: 0.7 },
        },
      );
    }, stageRef);

    return () => ctx.revert();
  }, []);

  const onKeyDown = (event) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      move(1);
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      move(-1);
    }
  };

  const onPointerDown = (event) => {
    pointerRef.current = { x: event.clientX, y: event.clientY };
  };

  const onPointerUp = (event) => {
    const start = pointerRef.current;
    pointerRef.current = null;
    if (!start) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) move(dx < 0 ? 1 : -1);
  };

  return (
    <section
      className={`section ${styles.works}`}
      id="works"
      ref={sectionRef}
      aria-labelledby="works-title"
    >
      <Reveal className="inner">
        <SectionHead
          title="Работы"
          id="works-title"
          text="Собрала здесь примеры ламинирования ресниц и бровей, чтобы вы могли увидеть результат на разных типах ресниц и выбрать эффект, который нравится именно вам."
          aside={
            <div className={styles.controls}>
              <p className={styles.counter} aria-hidden="true">
                <span className={styles.counterCurrent}>{pad(index + 1)}</span>
                <span className={styles.counterTotal}>/ {pad(works.length)}</span>
              </p>
              <div className={styles.arrows}>
                <button type="button" className={styles.arrow} onClick={() => move(-1)} aria-label="Предыдущая работа">
                  <Arrow direction="prev" />
                </button>
                <button type="button" className={styles.arrow} onClick={() => move(1)} aria-label="Следующая работа">
                  <Arrow direction="next" />
                </button>
              </div>
            </div>
          }
        />

        <div
          className={`reveal ${styles.stage}`}
          ref={stageRef}
          role="group"
          aria-roledescription="Галерея работ"
          aria-label={`Работа ${index + 1} из ${works.length}: ${slide.category}`}
          tabIndex={0}
          onKeyDown={onKeyDown}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
        >
          <div className={styles.column}>
            <div className={styles.head}>
              <p className={styles.index} data-slide-part aria-hidden="true">
                {pad(slide.id)}
              </p>
              <p className={`label ${styles.category}`} data-slide-part>
                {slide.category}
              </p>
            </div>
            <div className={styles.detailWrap}>
              <figure className={`reveal-img ${styles.detail}`} data-slide-part>
                <Image
                  key={slide.detail}
                  src={slide.detail}
                  alt={slide.detailAlt}
                  fill
                  sizes="(max-width: 900px) 45vw, 26vw"
                  className={styles.image}
                />
              </figure>
            </div>
          </div>

          <figure className={`reveal-img ${styles.featured}`} data-slide-part>
            <Image
              key={slide.image}
              src={slide.image}
              alt={slide.imageAlt}
              fill
              sizes="(max-width: 900px) 100vw, 54vw"
              className={styles.image}
            />
          </figure>
        </div>

        <ul className={`reveal ${styles.rail}`} aria-label="Все работы">
          {works.map((work, i) => (
            <li key={work.id}>
              <button
                type="button"
                className={`${styles.thumb} ${i === index ? styles.thumbActive : ''}`}
                onClick={() => goTo(i)}
                aria-label={`Показать работу ${pad(work.id)} — ${work.category}`}
                aria-current={i === index ? 'true' : undefined}
              >
                <Image src={work.image} alt="" fill sizes="140px" className={styles.image} />
              </button>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
