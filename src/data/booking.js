/**
 * Шаги записи. Варианты «что хотите получить» зависят от выбранной процедуры:
 * лишних шагов и полей нет, спрашиваем только то, что реально нужно мастеру.
 */
export const goalsByService = {
  lashes: [
    { id: 'natural', label: 'Лёгкий естественный подъём' },
    { id: 'expressive', label: 'Более выраженный изгиб' },
    { id: 'advice', label: 'Не знаю — нужен совет мастера' },
  ],
  brows: [
    { id: 'natural', label: 'Естественная уложенная форма' },
    { id: 'dense', label: 'Более плотная, объёмная бровь' },
    { id: 'advice', label: 'Не знаю — нужен совет мастера' },
  ],
  'lashes-brows': [
    { id: 'natural', label: 'Естественный результат' },
    { id: 'expressive', label: 'Более выразительный акцент' },
    { id: 'advice', label: 'Не знаю — нужен совет мастера' },
  ],
};

export const dayparts = [
  { id: 'morning', label: 'Утро', hint: 'до 12:00' },
  { id: 'day', label: 'День', hint: '12:00 — 17:00' },
  { id: 'evening', label: 'Вечер', hint: 'после 17:00' },
  { id: 'any', label: 'Не важно', hint: 'подстроюсь' },
];

export const STEPS = [
  { id: 'service', title: 'Какая процедура вас интересует?' },
  { id: 'goal', title: 'Какой результат хотите получить?' },
  { id: 'time', title: 'Когда вам удобно?' },
  { id: 'contacts', title: 'Как с вами связаться?' },
];
