/** Пункты навигации: используются в шапке, мобильном меню и подвале. */
export const navItems = [
  { label: 'Услуги', target: 'services' },
  { label: 'Работы', target: 'works' },
  { label: 'Контакты', target: 'contacts' },
];

export const footerNavItems = [...navItems, { label: 'Отзывы', target: 'reviews' }];
