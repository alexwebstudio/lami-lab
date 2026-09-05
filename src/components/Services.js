'use client';

import Image from 'next/image';
import { useState } from 'react';
import Reveal from './Reveal';
import SectionHead from './SectionHead';
import ServiceModal from './ServiceModal';
import { services } from '@/data/services';
import styles from './Services.module.css';

export default function Services() {
  const [active, setActive] = useState(null);

  return (
    <section className={`section ${styles.services}`} id="services" aria-labelledby="services-title">
      <Reveal className="inner">
        <SectionHead
          title="Услуги и цены"
          id="services-title"
          text="Форму и эффект подбираю под ваши черты, а не по шаблону."
        />

        <ul className={styles.grid}>
          {services.map((service, index) => (
            <li key={service.id} className={`reveal ${styles.card}`}>
              <div className={`reveal-img ${styles.media}`} data-corner={service.corner || undefined}>
                <Image
                  src={service.image}
                  alt={service.imageAlt}
                  fill
                  sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
                  className={styles.mediaImg}
                />
                <span className={styles.index} aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>

              <div className={styles.body}>
                <h3 className={`h3 ${styles.title}`}>{service.title}</h3>
                <p className={styles.summary}>{service.summary}</p>
                <p className={styles.price}>
                  <span className={styles.priceFrom}>от</span>
                  {service.price.replace(/^от\s*/, '')}
                </p>
              </div>

              <button
                type="button"
                className={`pill pill--outline ${styles.more}`}
                onClick={() => setActive(service)}
              >
                Подробнее о процедуре
              </button>
            </li>
          ))}
        </ul>
      </Reveal>

      <ServiceModal service={active} onClose={() => setActive(null)} />
    </section>
  );
}
