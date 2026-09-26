import { api } from "./axios";
import type { Booking, UnseenBookingsResponse } from "../types/padel.types";

interface BookingPayload {
  timeslotId: string;
  firstName: string;
  lastName: string;
  dni: number;
  email: string;
  whatsapp: number;
}

interface BookingFilters {
  date?: string; // un día puntual (YYYY-MM-DD)
  from?: string; // rango: desde (YYYY-MM-DD, incluido)
  to?: string; // rango: hasta (YYYY-MM-DD, incluido)
  dni?: number;
}

export const getBookings = async (filters: BookingFilters = {}): Promise<Booking[]> => {
  const { data } = await api.get("/bookings", { params: filters });
  return data;
};

// El back responde apenas guarda la reserva (< 1s). Si algo lo traba, cortamos a los 8s
// y el formulario verifica si la reserva igual quedó guardada (ver findBookingForSlot).
const CREATE_BOOKING_TIMEOUT_MS = 8_000;

export const createBooking = async (payload: BookingPayload): Promise<Booking> => {
  const { data } = await api.post("/bookings", payload, { timeout: CREATE_BOOKING_TIMEOUT_MS });
  return data;
};

export const findBookingForSlot = async (dni: number, date: string, timeslotId: string) => {
  const bookings = await getBookings({ dni, date });
  return bookings.find((b) => String(b.timeslotId) === timeslotId) ?? null;
};

export const getUnseenBookings = async (): Promise<UnseenBookingsResponse> => {
  const { data } = await api.get("/bookings/unseen");
  return data;
};

export const markBookingSeen = async (id: string): Promise<Booking> => {
  const { data } = await api.patch(`/bookings/${id}/seen`);
  return data;
};

export const markAllBookingsSeen = async () => {
  const { data } = await api.patch("/bookings/seen-all");
  return data;
};

export const cancelBooking = async (id: string) => {
  const { data } = await api.delete(`/bookings/${id}`);
  return data;
};
