import Link from 'next/link';
import Footer from './Footer';
import { site } from '@/data/site';
import styles from './LegalPage.module.css';

/**
 * Общий шаблон правовых страниц: шапка с возвратом на главную,
 * текст документа и общий подвал сайта.
 */
export default function LegalPage({ document: doc }) {
  return (
    <>
      <header className={styles.bar}>
        <div className={`inner ${styles.barInner}`}>
          <Link className={styles.logo} href="/" aria-label={`${site.name} — на главную`}>
            {site.name}
          </Link>
          <Link className={`pill pill--outline pill--sm ${styles.back}`} href="/">
            На главную
          </Link>
        </div>
      </header>

      <main className={`section ${styles.page}`}>
        <div className={`inner ${styles.inner}`}>
          <h1 className={`h2 ${styles.title}`}>{doc.title}</h1>
          <p className={`lead ${styles.intro}`}>{doc.intro}</p>
          {doc.notice ? <p className={styles.notice}>{doc.notice}</p> : null}

          <div className={styles.body}>
            {doc.sections.map((section) => (
              <section key={section.title} className={styles.block}>
                <h2 className={styles.blockTitle}>{section.title}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 28)}>{paragraph}</p>
                ))}
              </section>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
