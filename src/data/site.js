/**
 * Единственный источник контактных данных и настроек сайта.
 * Меняется здесь — обновляется везде: шапка, контакты, подвал, меню, разметка Schema.org.
 */

/**
 * Домен продакшена. Задаётся переменной окружения NEXT_PUBLIC_SITE_URL
 * (см. .env.example). Используется для canonical, Open Graph и sitemap.
 */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');

/**
 * Ссылка онлайн-записи DIKIDI. Все кнопки записи на сайте — в шапке, героя,
 * контактах, подвале, мобильном меню, липкой панели и карточках процедур —
 * ведут сюда напрямую. Меняется в одном месте.
 *
 * Если сюда поставить null, кнопки вернутся к собственной пошаговой форме
 * с отправкой заявки в Telegram (`BookingFlow` + `/api/booking`).
 */
export const DKD_URL = 'https://dikidi.net/2099130';

export const site = {
  name: 'LAMI LAB',
  legalName: 'LAMI LAB — студия ламинирования ресниц и бровей',
  master: 'Татьяна',
  city: 'Караганда',
  region: 'Карагандинская область',
  country: 'KZ',
  phone: '+7-778-713-82-82',
  phoneHref: 'tel:+77787138282',
  phoneRaw: '+77787138282',
  whatsappHref: 'https://wa.me/77787138282',
  instagram: '@lami_lab09',
  instagramHref: 'https://www.instagram.com/lami_lab09/',
  address: 'г. Караганда, ул Ермекова 15/2',
  addressShort: 'г. Караганда, ул. Ермекова 15/2',
  street: 'улица Ермекова, 15/2',
  mapQuery: 'Казахстан, Караганда, улица Ермекова 15/2',
  gis: 'https://2gis.kz/karaganda/search/%D0%95%D1%80%D0%BC%D0%B5%D0%BA%D0%BE%D0%B2%D0%B0%2015%2F2',
  developer: { label: 'Разработано Alex Web Studio', href: 'https://AlexWebStudio.ru' },
};


/**
 * Карта. Нужен 2ГИС, но для встраиваемой карты 2ГИС требуется ссылка виджета
 * из карточки организации (2ГИС → карточка студии → «Поделиться» → «Виджет»,
 * ссылка вида https://widgets.2gis.com/widget?type=firmsonmap&options=...).
 * Такой ссылки в проекте пока нет, выдумывать её нельзя: неверные координаты
 * отправят клиента не по адресу.
 *
 * Пока GIS_MAP_EMBED === null, карта работает на Google Maps по реальному
 * адресу студии. Впишите сюда ссылку виджета — карта переключится на 2ГИС,
 * править вёрстку не нужно.
 */
export const GIS_MAP_EMBED = null;

export const mapEmbedSrc =
  GIS_MAP_EMBED ||
  `https://www.google.com/maps?q=${encodeURIComponent(site.mapQuery)}&hl=ru&z=17&output=embed`;
