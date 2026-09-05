import styles from './SectionHead.module.css';

/**
 * Шапка секции: крупный заголовок и опциональные описание/слот справа.
 * Надзаголовков нет — иерархию держит сам заголовок.
 */
export default function SectionHead({ title, id, text, aside, align = 'row' }) {
  return (
    <div className={`${styles.head} ${align === 'stack' ? styles.stack : ''}`}>
      <h2 id={id} className={`h2 reveal ${styles.title}`}>
        {title}
      </h2>

      {text || aside ? (
        <div className={`reveal ${styles.aside}`}>
          {text ? <p className={`lead ${styles.text}`}>{text}</p> : null}
          {aside}
        </div>
      ) : null}
    </div>
  );
}
