'use client';

import Reveal from './Reveal';
import BookingButton from './BookingButton';
import { mapEmbedSrc, site } from '@/data/site';
import { ArrowUpRightIcon, InstagramIcon, PhoneIcon, PinIcon } from './icons';
import styles from './Contacts.module.css';

const rows = [
  {
    key: 'phone',
    label: 'Телефон',
    value: site.phone,
    href: site.phoneHref,
    Icon: PhoneIcon,
  },
  {
    key: 'instagram',
    label: 'Instagram',
    value: site.instagram,
    href: site.instagramHref,
    external: true,
    Icon: InstagramIcon,
  },
  {
    key: 'address',
    label: 'Адрес',
    value: site.addressShort,
    href: site.gis,
    external: true,
    Icon: PinIcon,
  },
];

export default function Contacts() {
  return (
    <section className={`section ${styles.contacts}`} id="contacts" aria-labelledby="contacts-title">
      <Reveal className="inner">
        <h2 id="contacts-title" className={`h2 reveal ${styles.title}`}>
          Контакты
        </h2>

        <div className={styles.grid}>
          <div className={styles.left}>
            <ul className={styles.list}>
              {rows.map(({ key, label, value, href, external, Icon }) => (
                <li key={key} className="reveal">
                  <a
                    className={styles.row}
                    href={href}
                    {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
                  >
                    <span className={styles.icon} aria-hidden="true">
                      <Icon />
                    </span>
                    <span className={styles.label}>{label}</span>
                    <span className={styles.value}>{value}</span>
                    <span className={styles.rowArrow} aria-hidden="true">
                      <ArrowUpRightIcon />
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <div className={`reveal ${styles.actions}`}>
              <BookingButton className="pill pill--primary" />
              <a className="pill pill--outline" href={site.whatsappHref} target="_blank" rel="noreferrer">
                Написать в WhatsApp
              </a>
            </div>
          </div>

          <div className={`reveal-img ${styles.map}`}>
            <iframe
              className={styles.mapFrame}
              src={mapEmbedSrc}
              title={`Карта: ${site.address}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <a className={styles.mapBar} href={site.gis} target="_blank" rel="noreferrer">
              <span>{site.addressShort}</span>
              <span className={styles.mapBarAction}>
                Открыть в 2ГИС
                <ArrowUpRightIcon />
              </span>
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
