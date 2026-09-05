'use client';

import Reveal from './Reveal';
import SectionHead from './SectionHead';
import { reviews } from '@/data/reviews';
import { site } from '@/data/site';
import { ArrowUpRightIcon, QuoteIcon } from './icons';
import styles from './Reviews.module.css';

const sources = [
  { key: 'gis', name: '2ГИС', caption: 'Карточка студии', href: site.gis },
  { key: 'instagram', name: 'Instagram', caption: site.instagram, href: site.instagramHref },
];

export default function Reviews() {
  const hasReviews = reviews.length > 0;

  return (
    <section className={`section ${styles.reviews}`} id="reviews" aria-labelledby="reviews-title">
      <Reveal className="inner">
        {hasReviews ? (
          <>
            <SectionHead
              title="Отзывы"
              id="reviews-title"
              aside={
                <a className="pill pill--outline" href={site.gis} target="_blank" rel="noreferrer">
                  Все отзывы в 2ГИС
                </a>
              }
            />
            <ul className={styles.grid}>
              {reviews.map((review) => (
                <li key={review.id} className={`reveal ${styles.card}`}>
                  <blockquote className={styles.quote}>{review.text}</blockquote>
                  <p className={styles.meta}>
                    <span className={styles.author}>{review.author}</span>
                    {review.date ? <span>{review.date}</span> : null}
                  </p>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className={styles.editorial}>
            <div className={styles.side}>
              <span className={styles.mark} aria-hidden="true">
                <QuoteIcon />
              </span>
              <h2 id="reviews-title" className={`h2 reveal ${styles.title}`}>
                Отзывы
              </h2>
              <p className={`lead reveal ${styles.text}`}>
                Живые отзывы клиентов собираются на площадках, где их нельзя отредактировать —
                в карточке студии 2ГИС и в Instagram.
              </p>
            </div>

            <ul className={styles.sources}>
              {sources.map((source) => (
                <li key={source.key} className="reveal">
                  <a className={styles.source} href={source.href} target="_blank" rel="noreferrer">
                    <span className={styles.sourceName}>{source.name}</span>
                    <span className={styles.sourceCaption}>{source.caption}</span>
                    <span className={styles.sourceArrow} aria-hidden="true">
                      <ArrowUpRightIcon />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Reveal>
    </section>
  );
}
