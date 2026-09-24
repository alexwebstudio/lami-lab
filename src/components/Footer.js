'use client';

import Reveal from './Reveal';
import { footerNavItems } from '@/data/navigation';
import { site } from '@/data/site';
import { ArrowUpRightIcon } from './icons';
import { scrollToSection, scrollToTop } from '@/lib/scroll';
import styles from './Footer.module.css';

const year = new Date().getFullYear();

export default function Footer() {
  const go = (event, target) => {
    event.preventDefault();
    scrollToSection(target);
  };

  return (
    <footer className={styles.footer}>
      <Reveal className={`inner ${styles.inner}`} stagger={0.07}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <p className={styles.logo} aria-hidden="true">
              {site.name}
            </p>
            <p className={`reveal ${styles.about}`}>
              Студия ламинирования ресниц и бровей в Караганде. Естественный изгиб, аккуратная
              форма и выразительный взгляд без ежедневной укладки.
            </p>
          </div>

          <div className={`reveal ${styles.columns}`}>
            <div className={styles.col}>
              <p className={styles.colTitle}>Навигация</p>
              <ul className={styles.links}>
                {footerNavItems.map((item) => (
                  <li key={item.target}>
                    <a href={`#${item.target}`} onClick={(e) => go(e, item.target)}>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.col}>
              <p className={styles.colTitle}>Контакты</p>
              <ul className={styles.links}>
                <li>
                  <a href={site.phoneHref}>{site.phone}</a>
                </li>
                <li>
                  <a href={site.whatsappHref} target="_blank" rel="noreferrer">
                    WhatsApp
                  </a>
                </li>
                <li>
                  <a href={site.instagramHref} target="_blank" rel="noreferrer">
                    Instagram
                  </a>
                </li>
                <li>
                  <a className={styles.address} href={site.gis} target="_blank" rel="noreferrer">
                    {site.addressShort}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className={`reveal ${styles.bottom}`}>
          <p className={styles.copy}>
            © {year} {site.name} · ламинирование ресниц и бровей, {site.city}
          </p>
          <a className={styles.dev} href={site.developer.href} target="_blank" rel="noreferrer">
            <span className={styles.devLabel}>Разработано</span>
            <span className={styles.devName}>Alex Web Studio</span>
            <ArrowUpRightIcon />
          </a>
          <button type="button" className={styles.up} onClick={scrollToTop}>
            Наверх
            <span className={styles.upArrow} aria-hidden="true">
              <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
                <path
                  d="M6 13V1M1 6l5-5 5 5"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </button>
        </div>
      </Reveal>
    </footer>
  );
}
