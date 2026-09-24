import { api } from "./axios";
import type { TimeSlot, TimeSlotPayload, TimeSlotStatus } from "../types/padel.types";

interface TimeSlotFilters {
  date?: string; // YYYY-MM-DD
  courtId?: string;
  status?: TimeSlotStatus;
}

export const getTimeSlots = async (filters: TimeSlotFilters = {}): Promise<TimeSlot[]> => {
  const { data } = await api.get("/timeslots", { params: filters });
  return data;
};

export const createTimeSlot = async (payload: TimeSlotPayload): Promise<TimeSlot> => {
  const { data } = await api.post("/timeslots", payload);
  return data;
};

export const deleteTimeSlot = async (id: string) => {
  const { data } = await api.delete(`/timeslots/${id}`);
  return data;
};
