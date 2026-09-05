'use client';

import Image from 'next/image';
import Modal from './Modal';
import { useBooking } from './BookingProvider';
import { DKD_URL } from '@/data/site';
import styles from './ServiceModal.module.css';

const SECTIONS = [
  { key: 'suitable', title: 'Кому подходит' },
  { key: 'effect', title: 'Какой эффект' },
  { key: 'process', title: 'Как проходит' },
  { key: 'care', title: 'Уход после процедуры' },
];

export default function ServiceModal({ service, onClose }) {
  const { openBooking } = useBooking();

  /* Карточка закрывается, форма записи открывается с выбранной процедурой —
     два поп-апа не наслаиваются друг на друга. */
  const startBooking = (id) => {
    onClose();
    window.setTimeout(() => openBooking(id), 240);
  };

  return (
    <Modal open={Boolean(service)} onClose={onClose} labelledBy="service-title" size="wide">
      {service ? (
        <article className={styles.card}>
          <figure className={styles.media}>
            <Image
              src={service.image}
              alt={service.imageAlt}
              fill
              sizes="(max-width: 760px) 100vw, 340px"
              className={styles.mediaImg}
            />
          </figure>

          <div className={styles.body}>
            <header className={styles.head}>
              <h2 id="service-title" className={styles.title}>
                {service.title}
              </h2>
              <p className={styles.price}>{service.price}</p>
              <p className={styles.lead}>{service.details.lead}</p>
            </header>

            <div className={styles.about}>
              {service.details.about.map((paragraph) => (
                <p key={paragraph.slice(0, 28)}>{paragraph}</p>
              ))}
            </div>

            <div className={styles.grid}>
              {SECTIONS.map(({ key, title }) => (
                <section key={key} className={styles.block}>
                  <h3 className={styles.blockTitle}>{title}</h3>
                  <ul className={styles.list}>
                    {service.details[key].map((item) => (
                      <li key={item.slice(0, 28)}>{item}</li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>

            <div className={styles.cta}>
              {DKD_URL ? (
                <a className="pill pill--primary" href={DKD_URL} target="_blank" rel="noreferrer">
                  Записаться на процедуру
                </a>
              ) : (
                <button
                  type="button"
                  className="pill pill--primary"
                  onClick={() => startBooking(service.id)}
                >
                  Записаться на процедуру
                </button>
              )}
            </div>
          </div>
        </article>
      ) : null}
    </Modal>
  );
}
