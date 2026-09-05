import { services } from '@/data/services';
import { dayparts, goalsByService } from '@/data/booking';

const TELEGRAM_API = 'https://api.telegram.org';

const digits = (value) => String(value || '').replace(/\D/g, '');

/** Экранирование для Telegram parse_mode=HTML. */
const esc = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

function buildMessage(data) {
  const service = services.find((item) => item.id === data.serviceId);
  const goal = (goalsByService[data.serviceId] || []).find((item) => item.id === data.goal);
  const daypart = dayparts.find((item) => item.id === data.daypart);

  const when = [
    data.date ? new Date(data.date).toLocaleDateString('ru-RU') : null,
    daypart && daypart.id !== 'any' ? daypart.label.toLowerCase() : null,
  ]
    .filter(Boolean)
    .join(', ');

  /* В сообщение попадают только заполненные поля. */
  const blocks = [
    ['Процедура', service ? `${service.title} — ${service.price}` : null],
    ['Пожелание', goal ? goal.label : null],
    ['Когда удобно', when || (daypart ? daypart.label : null)],
    ['Имя', data.name],
    ['Телефон', data.phone],
    ['Комментарий', data.comment],
  ].filter(([, value]) => Boolean(value));

  return [
    '<b>НОВАЯ ЗАПИСЬ — LAMI LAB</b>',
    '',
    ...blocks.map(([label, value]) => `<b>${label}:</b>\n${esc(value)}`),
  ].join('\n');
}

function validate(data) {
  const errors = [];
  if (!services.some((item) => item.id === data.serviceId)) errors.push('процедура');
  if (!(goalsByService[data.serviceId] || []).some((item) => item.id === data.goal)) errors.push('пожелание');
  if (!dayparts.some((item) => item.id === data.daypart)) errors.push('время');
  if (!data.name || String(data.name).trim().length < 2) errors.push('имя');
  if (digits(data.phone).length < 10) errors.push('телефон');
  return errors;
}

export async function POST(request) {
  let data;
  try {
    data = await request.json();
  } catch {
    return Response.json({ error: 'Не удалось прочитать данные формы.' }, { status: 400 });
  }

  const errors = validate(data);
  if (errors.length) {
    return Response.json(
      { error: `Проверьте поля: ${errors.join(', ')}.` },
      { status: 400 },
    );
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  /* Без ключей заявку отправить некуда — сообщаем честно, а не делаем вид,
     что заявка ушла. Ключи задаются в .env.local (см. .env.example). */
  if (!token || !chatId) {
    return Response.json(
      { error: 'Отправка заявок ещё не подключена. Позвоните или напишите в WhatsApp — запишу вас вручную.' },
      { status: 503 },
    );
  }

  const response = await fetch(`${TELEGRAM_API}/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: buildMessage(data),
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    console.error('Telegram sendMessage failed:', response.status, details);
    return Response.json(
      { error: 'Не удалось отправить заявку. Попробуйте ещё раз или позвоните нам.' },
      { status: 502 },
    );
  }

  return Response.json({ ok: true });
}
