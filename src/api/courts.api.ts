import { api } from "./axios";
import type { Court } from "../types/padel.types";

type CourtPayload = Omit<Court, "_id">;

export const getCourts = async (): Promise<Court[]> => {
  const { data } = await api.get("/courts");
  return data;
};

export const createCourt = async (payload: CourtPayload): Promise<Court> => {
  const { data } = await api.post("/courts", payload);
  return data;
};

export const updateCourt = async (id: string, payload: CourtPayload): Promise<Court> => {
  const { data } = await api.put(`/courts/${id}`, payload);
  return data;
};

export const deleteCourt = async (id: string) => {
  const { data } = await api.delete(`/courts/${id}`);
  return data;
};
