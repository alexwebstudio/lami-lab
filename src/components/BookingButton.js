'use client';

import { DKD_URL } from '@/data/site';
import { useBooking } from './BookingProvider';

/**
 * Кнопка записи — единая точка поведения для шапки, героя, контактов,
 * мобильного меню и карточек процедур.
 *
 * Пока DKD_URL не задан, открывается собственная пошаговая форма с отправкой
 * заявки в Telegram. Как только ссылка DKD появится в `site.js`, кнопка
 * становится обычной ссылкой на неё.
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
