'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { services } from '@/data/services';
import { dayparts, goalsByService, STEPS } from '@/data/booking';
import { site } from '@/data/site';
import styles from './Booking.module.css';

const EMPTY = {
  serviceId: null,
  goal: null,
  date: '',
  daypart: null,
  name: '',
  phone: '',
  comment: '',
};

const digits = (value) => value.replace(/\D/g, '');
const today = () => new Date().toISOString().slice(0, 10);
const formatDate = (value) => (value ? new Date(value).toLocaleDateString('ru-RU') : null);

export default function BookingFlow({ initialServiceId = null, onClose }) {
  const [step, setStep] = useState(initialServiceId ? 1 : 0);
  const [data, setData] = useState({ ...EMPTY, serviceId: initialServiceId });
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState('idle');
  const [errorText, setErrorText] = useState('');
  const bodyRef = useRef(null);
  const directionRef = useRef(1);

  const service = services.find((item) => item.id === data.serviceId);
  const goals = data.serviceId ? goalsByService[data.serviceId] : [];
  const goal = goals.find((item) => item.id === data.goal);
  const daypart = dayparts.find((item) => item.id === data.daypart);

  const set = (patch) => setData((current) => ({ ...current, ...patch }));

  const stepValid = useMemo(() => {
    if (step === 0) return Boolean(data.serviceId);
    if (step === 1) return Boolean(data.goal);
    if (step === 2) return Boolean(data.daypart);
    return data.name.trim().length >= 2 && digits(data.phone).length >= 10;
  }, [step, data]);

  /* Шаг меняется сразу, анимация — только оформление перехода.
     Так форма не может «застрять», если анимация не доиграла. */
  const goToStep = (next) => {
    directionRef.current = next > step ? 1 : -1;
    setStep(next);
    setTouched(false);
  };

  const next = () => {
    if (!stepValid) {
      setTouched(true);
      return;
    }
    goToStep(Math.min(step + 1, STEPS.length - 1));
  };

  const back = () => goToStep(Math.max(step - 1, 0));

  /* Выбор варианта сразу ведёт дальше — меньше кликов на пути к заявке. */
  const choose = (patch, autoAdvance = true) => {
    set(patch);
    if (autoAdvance && step < STEPS.length - 1) {
      window.setTimeout(() => goToStep(step + 1), 200);
    }
  };

  /* Появление содержимого шага: сдвиг по направлению перехода и стаггер полей. */
  useEffect(() => {
    const node = bodyRef.current;
    if (!node || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const from = directionRef.current > 0 ? 30 : -30;
    const ctx = gsap.context(() => {
      gsap.fromTo(node, { opacity: 0, x: from }, { opacity: 1, x: 0, duration: 0.42, ease: 'power3.out' });
      gsap.fromTo(
        node.querySelectorAll('[data-stagger]'),
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.05, delay: 0.06 },
      );
    }, bodyRef);
    return () => ctx.revert();
  }, [step, status]);

  const submit = async (event) => {
    event.preventDefault();
    if (!stepValid) {
      setTouched(true);
      return;
    }
    setStatus('sending');
    setErrorText('');
    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        setErrorText(payload.error || 'Не удалось отправить заявку. Попробуйте ещё раз.');
        setStatus('error');
        return;
      }
      setStatus('done');
    } catch {
      setErrorText('Нет связи с сервером. Проверьте интернет и попробуйте ещё раз.');
      setStatus('error');
    }
  };

  if (status === 'done') {
    return (
      <div className={styles.done} ref={bodyRef}>
        <span className={styles.doneMark} aria-hidden="true">
          <svg width="34" height="26" viewBox="0 0 34 26" fill="none">
            <path d="M2 13.5 12 23 32 3" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <h2 id="booking-title" className={styles.title} data-stagger>
          Спасибо! Заявка отправлена
        </h2>
        <p className={styles.text} data-stagger>
          Я свяжусь с вами по номеру {data.phone}, чтобы подтвердить время. Если нужно быстрее —
          напишите в WhatsApp.
        </p>
        <div className={styles.doneActions} data-stagger>
          <a className="pill pill--primary" href={site.whatsappHref} target="_blank" rel="noreferrer">
            Написать в WhatsApp
          </a>
          <button type="button" className="pill pill--outline" onClick={onClose}>
            Закрыть
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.flow}>
      <div className={styles.head}>
        <p className={styles.counter}>
          Шаг {step + 1} из {STEPS.length}
        </p>
        <h2 id="booking-title" className={styles.title}>
          {STEPS[step].title}
        </h2>
        <div className={styles.progress} role="presentation">
          {STEPS.map((item, index) => (
            <span key={item.id} className={index <= step ? styles.progressOn : undefined} />
          ))}
        </div>
      </div>

      <div className={styles.body} ref={bodyRef}>
        {step === 0 ? (
          <ul className={styles.options}>
            {services.map((item) => (
              <li key={item.id} data-stagger>
                <button
                  type="button"
                  className={`${styles.service} ${data.serviceId === item.id ? styles.selected : ''}`}
                  onClick={() => choose({ serviceId: item.id, goal: null })}
                  aria-pressed={data.serviceId === item.id}
                >
                  <span className={styles.serviceMedia}>
                    <Image src={item.image} alt="" fill sizes="120px" className={styles.serviceImg} />
                  </span>
                  <span className={styles.serviceBody}>
                    <span className={styles.serviceTitle}>{item.title}</span>
                    <span className={styles.servicePrice}>{item.price}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : null}

        {step === 1 ? (
          <ul className={styles.options}>
            {goals.map((item) => (
              <li key={item.id} data-stagger>
                <button
                  type="button"
                  className={`${styles.option} ${data.goal === item.id ? styles.selected : ''}`}
                  onClick={() => choose({ goal: item.id })}
                  aria-pressed={data.goal === item.id}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        ) : null}

        {step === 2 ? (
          <div className={styles.time}>
            <ul className={styles.dayparts}>
              {dayparts.map((item) => (
                <li key={item.id} data-stagger>
                  <button
                    type="button"
                    className={`${styles.daypart} ${data.daypart === item.id ? styles.selected : ''}`}
                    onClick={() => choose({ daypart: item.id }, false)}
                    aria-pressed={data.daypart === item.id}
                  >
                    <span className={styles.daypartLabel}>{item.label}</span>
                    <span className={styles.daypartHint}>{item.hint}</span>
                  </button>
                </li>
              ))}
            </ul>

            <label className={styles.field} data-stagger>
              <span className={styles.fieldLabel}>Желаемая дата — необязательно</span>
              <input
                type="date"
                className={styles.input}
                value={data.date}
                min={today()}
                onChange={(e) => set({ date: e.target.value })}
              />
            </label>
          </div>
        ) : null}

        {step === 3 ? (
          <form className={styles.form} onSubmit={submit} noValidate>
            <div className={styles.summary} data-stagger>
              <p className={styles.summaryTitle}>Проверьте запись</p>
              <dl className={styles.summaryList}>
                <div>
                  <dt>Процедура</dt>
                  <dd>{service ? `${service.title} — ${service.price}` : '—'}</dd>
                </div>
                <div>
                  <dt>Пожелание</dt>
                  <dd>{goal ? goal.label : '—'}</dd>
                </div>
                <div>
                  <dt>Когда</dt>
                  <dd>
                    {[formatDate(data.date), daypart && daypart.id !== 'any' ? daypart.label.toLowerCase() : null]
                      .filter(Boolean)
                      .join(', ') || (daypart ? daypart.label : '—')}
                  </dd>
                </div>
              </dl>
            </div>

            <label className={styles.field} data-stagger>
              <span className={styles.fieldLabel}>Имя</span>
              <input
                type="text"
                className={styles.input}
                value={data.name}
                autoComplete="name"
                placeholder="Как к вам обращаться"
                onChange={(e) => set({ name: e.target.value })}
              />
            </label>

            <label className={styles.field} data-stagger>
              <span className={styles.fieldLabel}>Телефон</span>
              <input
                type="tel"
                className={styles.input}
                value={data.phone}
                autoComplete="tel"
                inputMode="tel"
                placeholder="+7 ___ ___ __ __"
                onChange={(e) => set({ phone: e.target.value })}
              />
            </label>

            <label className={styles.field} data-stagger>
              <span className={styles.fieldLabel}>Комментарий — необязательно</span>
              <textarea
                className={styles.textarea}
                value={data.comment}
                rows={2}
                placeholder="Например: делала ламинирование месяц назад"
                onChange={(e) => set({ comment: e.target.value })}
              />
            </label>

            {touched && !stepValid ? (
              <p className={styles.error} role="alert">
                Укажите имя и телефон — без них я не смогу подтвердить запись.
              </p>
            ) : null}

            {status === 'error' ? (
              <p className={styles.error} role="alert">
                {errorText}{' '}
                <a href={site.phoneHref} className={styles.errorLink}>
                  {site.phone}
                </a>
              </p>
            ) : null}
          </form>
        ) : null}
      </div>

      <div className={styles.actions}>
        {step > 0 ? (
          <button type="button" className={`pill pill--outline ${styles.back}`} onClick={back}>
            Назад
          </button>
        ) : null}

        {step < STEPS.length - 1 ? (
          <button
            type="button"
            className={`pill pill--primary ${styles.next}`}
            onClick={next}
            aria-disabled={!stepValid}
          >
            Далее
          </button>
        ) : (
          <button
            type="button"
            className={`pill pill--primary ${styles.next}`}
            onClick={submit}
            disabled={status === 'sending'}
          >
            {status === 'sending' ? 'Отправляю…' : 'Записаться на процедуру'}
          </button>
        )}
      </div>
    </div>
  );
}
