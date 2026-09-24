'use client';

/** Высота компактной липкой шапки — на неё смещаются якоря. */
const HEADER_OFFSET = 76;

let lenis = null;

export function setLenis(instance) {
  lenis = instance;
}

export function getLenis() {
  return lenis;
}

/**
 * Плавная прокрутка к блоку по id (используется навигацией).
 * Если секции на текущей странице нет — например, открыта правовая страница —
 * переходим на главную к нужному якорю.
 */
export function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) {
    window.location.href = `/#${id}`;
    return;
  }
  if (lenis) {
    lenis.scrollTo(el, { duration: 1.2, offset: -HEADER_OFFSET });
  } else {
    window.scrollTo({
      top: el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET,
      behavior: 'smooth',
    });
  }
}

/** Плавный подъём в начало страницы. */
export function scrollToTop() {
  if (lenis) {
    lenis.scrollTo(0, { duration: 1.2 });
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

/**
 * Остановка прокрутки, пока открыт поп-ап или мобильное меню.
 *
 * Документ не сдвигается и не прокручивается программно — прокрутка просто
 * запрещается через overflow на <html>, поэтому после закрытия пользователь
 * остаётся ровно там, где открыл поп-ап. Lenis останавливается, а внутри
 * поп-апов стоит data-lenis-prevent, чтобы их собственный скролл работал.
 * Блокировки считаются: карточка процедуры может открыть что-то поверх себя.
 */
let locks = 0;

export function lockScroll() {
  locks += 1;
  if (locks > 1) return;
  document.documentElement.classList.add('is-locked');
  if (lenis) lenis.stop();
}

export function unlockScroll() {
  locks = Math.max(0, locks - 1);
  if (locks > 0) return;
  document.documentElement.classList.remove('is-locked');
  if (lenis) lenis.start();
}
