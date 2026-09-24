import type { TimeSlot } from "../types/padel.types";

/*
 * Las fechas de turnos se guardan en el back como medianoche UTC del día ("2026-09-25T00:00:00Z")
 * y se filtran con "YYYY-MM-DD". Por eso trabajamos siempre con la clave "YYYY-MM-DD" y nunca
 * con new Date(iso) directo: en Argentina (UTC-3) eso mostraría el día anterior.
 */

const pad = (n: number) => String(n).padStart(2, "0");

export const toDateKey = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export const todayKey = () => toDateKey(new Date());

export const dateKeyFromIso = (iso: string) => iso.slice(0, 10);

const dateFromKey = (key: string) => {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
};

export const addDaysToKey = (key: string, days: number) => {
  const date = dateFromKey(key);
  date.setDate(date.getDate() + days);
  return toDateKey(date);
};

export const formatDateKey = (
  key: string,
  options: Intl.DateTimeFormatOptions = { weekday: "long", day: "numeric", month: "long" }
) => {
  const text = dateFromKey(key).toLocaleDateString("es-AR", options);
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const formatShortDate = (iso: string) =>
  formatDateKey(dateKeyFromIso(iso), { day: "2-digit", month: "2-digit", year: "numeric" });

export const formatMoney = (amount?: number) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 })
    .format(amount ?? 0);

/* ===== Horarios ===== */

export const timeToMinutes = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

export const minutesToTime = (minutes: number) => `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`;

// Divide la franja [from, to] en turnos consecutivos de `duration` minutos
export const buildTimeRanges = (from: string, to: string, duration: number) => {
  const ranges: { startTime: string; endTime: string }[] = [];
  const end = timeToMinutes(to);

  for (let start = timeToMinutes(from); start + duration <= end; start += duration) {
    ranges.push({ startTime: minutesToTime(start), endTime: minutesToTime(start + duration) });
  }

  return ranges;
};

export const buildDateRange = (from: string, to: string) => {
  const dates: string[] = [];
  for (let key = from; key <= to; key = addDaysToKey(key, 1)) dates.push(key);
  return dates;
};

// Un turno de hoy cuyo horario ya empezó no se puede reservar
export const isPastSlot = (slot: TimeSlot) => {
  const slotDay = dateKeyFromIso(slot.date);
  const today = todayKey();
  if (slotDay !== today) return slotDay < today;

  const now = new Date();
  return timeToMinutes(slot.startTime) <= now.getHours() * 60 + now.getMinutes();
};

export const isPadelType = (type?: string) => (type ?? "").trim().toLowerCase() === "padel";

/* ===== Sincronización de reservas ===== */

// Avisa a la campana de notificaciones y a las tablas de reservas que algo cambió
const BOOKINGS_CHANGED_EVENT = "padel:bookings-changed";

export const notifyBookingsChanged = () => window.dispatchEvent(new Event(BOOKINGS_CHANGED_EVENT));

export const onBookingsChanged = (callback: () => void) => {
  window.addEventListener(BOOKINGS_CHANGED_EVENT, callback);
  return () => window.removeEventListener(BOOKINGS_CHANGED_EVENT, callback);
};

/* ===== Errores ===== */

export const getErrorMessage = (error: unknown, fallback: string) => {
  const err = error as { response?: { data?: { message?: string } }; request?: unknown };
  if (err?.response?.data?.message) return err.response.data.message;
  if (err?.request && !err?.response) return "No se pudo conectar con el servidor. Revisá tu conexión e intentá nuevamente.";
  return fallback;
};
