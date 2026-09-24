export type TimeSlotStatus = "LIBRE" | "OCUPADO";

export interface Court {
  _id: string;
  number: number;
  name: string;
  type: string;
  active: boolean;
}

export interface CourtFormData {
  number: string;
  name: string;
  type: string;
  active: boolean;
}

export interface Price {
  _id: string;
  amount: number;
  description: string;
  type: string;
  active: boolean;
  courtId: Pick<Court, "_id" | "number" | "name" | "type"> | string;
}

export interface PriceFormData {
  amount: string;
  description: string;
  type: string;
  courtId: string;
  active: boolean;
}

export interface TimeSlot {
  _id: string;
  courtId: Pick<Court, "_id" | "number" | "name" | "type"> | null;
  priceId: Pick<Price, "_id" | "amount" | "description"> | null;
  date: string;
  startTime: string;
  endTime: string;
  status: TimeSlotStatus;
}

export interface TimeSlotPayload {
  courtId: string;
  priceId: string;
  date: string; // YYYY-MM-DD
  startTime: string;
  endTime: string;
}

export interface TimeSlotGeneratorData {
  courtId: string;
  priceId: string;
  dateFrom: string;
  dateTo: string;
  fromTime: string;
  toTime: string;
  duration: number; // minutos
}

export interface Booking {
  _id: string;
  timeslotId: string;
  firstName: string;
  lastName: string;
  dni: number;
  email: string;
  whatsapp: number;
  courtName: string;
  date: string;
  startTime: string;
  endTime: string;
  paidAmount: number;
  bookingDate: string;
  seenByAdmin: boolean;
}

export interface BookingFormData {
  firstName: string;
  lastName: string;
  dni: string;
  email: string;
  whatsapp: string;
}

export interface UnseenBookingsResponse {
  count: number;
  bookings: Booking[];
}
