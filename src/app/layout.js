import { Italiana } from 'next/font/google';
import localFont from 'next/font/local';
import SmoothScroll from '@/components/SmoothScroll';
import BookingProvider from '@/components/BookingProvider';
import { site, siteUrl } from '@/data/site';
import './globals.css';

/* Логотип — Italiana (шрифт макета, есть в Google Fonts). */
const italiana = Italiana({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-italiana',
});

/* Интерфейс — Jura, вариативный файл из поставки заказчика. */
const jura = localFont({
  src: '../../public/fonts/Jura-Variable.woff2',
  weight: '300 700',
  style: 'normal',
  display: 'swap',
  variable: '--font-jura',
});

/* Заголовки и основной текст — Kyiv*Type Sans, вариативный файл из поставки. */
const kyivType = localFont({
  src: '../../public/fonts/KyivTypeSans-Variable.woff2',
  weight: '200 900',
  style: 'normal',
  display: 'swap',
  variable: '--font-kyiv',
});

const description =
  'Ламинирование ресниц и бровей в Караганде, студия LAMI LAB на Ермекова 15/2. Естественный изгиб и аккуратная форма, которые держатся сами — без ежедневной укладки. Запись онлайн и по телефону.';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Ламинирование ресниц и бровей в Караганде — студия LAMI LAB',
    template: '%s — LAMI LAB',
  },
  description,
  applicationName: site.name,
  authors: [{ name: site.name }],
  keywords: [
    'ламинирование ресниц Караганда',
    'ламинирование бровей Караганда',
    'ламинирование ресниц и бровей Караганда',
    'записаться на ламинирование ресниц Караганда',
    'мастер по ресницам и бровям Караганда',
    'LAMI LAB',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: siteUrl,
    siteName: site.name,
    title: 'Ламинирование ресниц и бровей в Караганде — студия LAMI LAB',
    description,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ламинирование ресниц и бровей в Караганде — студия LAMI LAB',
    description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  formatDetection: { telephone: true, address: true },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#e0d1c4',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru" className={`${italiana.variable} ${jura.variable} ${kyivType.variable}`}>
      <body>
        <SmoothScroll />
        <BookingProvider>{children}</BookingProvider>
      </body>
    </html>
  );
}
