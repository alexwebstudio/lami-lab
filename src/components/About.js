'use client';

import Image from 'next/image';
import Reveal from './Reveal';
import { about, trust } from '@/data/about';
import { site } from '@/data/site';
import styles from './About.module.css';

export default function About() {
  return (
    <section className={`section ${styles.about}`} id="about" aria-labelledby="about-title">
      <span className={`glow ${styles.glow}`} aria-hidden="true" />

      <Reveal className={`inner ${styles.inner}`}>
        <div className={styles.grid}>
          <div className={styles.text}>
            <h2 id="about-title" className={`h2 reveal ${styles.title}`}>
              Обо мне
            </h2>

            {about.intro.map((paragraph) => (
              <p key={paragraph.slice(0, 24)} className={`lead reveal ${styles.paragraph}`}>
                {paragraph}
              </p>
            ))}

            {about.showStats ? (
              <ul className={`reveal ${styles.stats}`}>
                {about.stats.map((stat) => (
                  <li key={stat.label}>
                    <span className={styles.statValue}>{stat.value}</span>
                    <span className={styles.statLabel}>{stat.label}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <figure className={`reveal-img ${styles.portrait}`}>
            <Image
              src={about.portrait}
              alt={about.portraitAlt}
              fill
              sizes="(max-width: 900px) 100vw, 40vw"
              className={styles.portraitImg}
            />
            <figcaption className={styles.portraitTag}>{site.master}</figcaption>
          </figure>
        </div>

        <div className={styles.trust}>
          <h3 className={`reveal ${styles.trustHead}`}>Как я работаю</h3>

          <ul className={styles.trustList}>
            {trust.map((item) => (
              <li key={item.number} className={`reveal ${styles.trustItem}`}>
                <span className={styles.trustNumber}>{item.number}</span>
                <div className={styles.trustBody}>
                  <p className={`h3 ${styles.trustTitle}`}>{item.title}</p>
                  <p className={styles.trustText}>{item.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}
