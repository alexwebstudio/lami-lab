'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Появление содержимого при скролле.
 * `.reveal`     — текст и карточки: сдвиг вверх с прозрачностью;
 * `.reveal-img` — изображения: раскрытие маской со снятием масштаба.
 * Стартовое состояние задаёт GSAP, поэтому без JS контент виден сразу.
 */
export default function Reveal({
  children,
  className,
  id,
  as: Tag = 'div',
  stagger = 0.08,
  y = 28,
  ...rest
}) {
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    gsap.registerPlugin(ScrollTrigger);

    const items = root.querySelectorAll('.reveal');
    const images = root.querySelectorAll('.reveal-img');
    if (!items.length && !images.length) return undefined;

    /* На узких экранах анимация запускается раньше — иначе на телефоне
       элемент успевает оказаться в центре экрана уже проявленным. */
    const start = window.innerWidth < 900 ? 'top 92%' : 'top 86%';

    const ctx = gsap.context(() => {
      if (items.length) {
        gsap.fromTo(
          items,
          { opacity: 0, y },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            stagger,
            clearProps: 'transform',
            scrollTrigger: { trigger: root, start, once: true },
          },
        );
      }

      images.forEach((image) => {
        gsap.fromTo(
          image,
          { clipPath: 'inset(0% 0% 100% 0%)' },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: { trigger: image, start, once: true },
          },
        );
        const inner = image.querySelector('img');
        if (inner) {
          gsap.fromTo(
            inner,
            { scale: 1.16 },
            {
              scale: 1,
              duration: 1.4,
              ease: 'power3.out',
              scrollTrigger: { trigger: image, start, once: true },
            },
          );
        }
      });
    }, ref);

    return () => ctx.revert();
  }, [stagger, y]);

  return (
    <Tag ref={ref} className={className} id={id} {...rest}>
      {children}
    </Tag>
  );
}
