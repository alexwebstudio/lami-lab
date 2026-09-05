'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import Modal from './Modal';
import BookingFlow from './BookingFlow';

const BookingContext = createContext({ openBooking: () => {} });

export const useBooking = () => useContext(BookingContext);

/**
 * Единая точка онлайн-записи. Кнопки со всего сайта открывают пошаговую форму;
 * из карточки процедуры услуга подставляется сразу, и первый шаг пропускается.
 */
export default function BookingProvider({ children }) {
  const [state, setState] = useState({ open: false, serviceId: null });

  const openBooking = useCallback((serviceId = null) => {
    setState({ open: true, serviceId: typeof serviceId === 'string' ? serviceId : null });
  }, []);

  const close = useCallback(() => setState({ open: false, serviceId: null }), []);

  const value = useMemo(() => ({ openBooking }), [openBooking]);

  return (
    <BookingContext.Provider value={value}>
      {children}
      <Modal open={state.open} onClose={close} labelledBy="booking-title">
        {state.open ? <BookingFlow initialServiceId={state.serviceId} onClose={close} /> : null}
      </Modal>
    </BookingContext.Provider>
  );
}
