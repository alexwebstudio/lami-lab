'use client';

import { DKD_URL } from '@/data/site';
import { useBooking } from './BookingProvider';

/**
 * Кнопка записи — единая точка поведения для шапки, героя, контактов,
 * мобильного меню, липкой панели и карточек процедур.
 *
 * Пока в `site.js` задан DKD_URL, это ссылка на DIKIDI. Если ссылку убрать,
 * кнопка снова открывает собственную пошаговую форму записи.
 */
export default function BookingButton({
  className,
  children = 'Записаться онлайн',
  serviceId = null,
  ...rest
}) {
  const { openBooking } = useBooking();

  if (DKD_URL) {
    return (
      <a className={className} href={DKD_URL} target="_blank" rel="noreferrer" {...rest}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" className={className} onClick={() => openBooking(serviceId)} {...rest}>
      {children}
    </button>
  );
}
