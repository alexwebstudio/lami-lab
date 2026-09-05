import { services } from '@/data/services';
import { site, siteUrl } from '@/data/site';

/**
 * Schema.org разметка организации. Только реальные данные проекта:
 * название, телефон, адрес, соцсети и прайс услуг из макета.
 */
export default function StructuredData() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BeautySalon',
    '@id': `${siteUrl}/#business`,
    name: site.name,
    alternateName: site.legalName,
    description:
      'Студия ламинирования ресниц и бровей в Караганде. Естественный изгиб и аккуратная форма, которые держатся без ежедневной укладки.',
    url: siteUrl,
    telephone: site.phoneRaw,
    image: `${siteUrl}/images/hero-model.png`,
    priceRange: 'от 4 000 ₸',
    currenciesAccepted: 'KZT',
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.street,
      addressLocality: site.city,
      addressRegion: site.region,
      addressCountry: site.country,
    },
    areaServed: { '@type': 'City', name: site.city },
    sameAs: [site.instagramHref, site.gis],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Услуги студии',
      itemListElement: services.map((service) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: service.title, serviceType: service.title },
        priceCurrency: 'KZT',
        priceSpecification: {
          '@type': 'PriceSpecification',
          minPrice: Number(service.price.replace(/\D/g, '')),
          priceCurrency: 'KZT',
        },
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
