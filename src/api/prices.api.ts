import { api } from "./axios";
import type { Price } from "../types/padel.types";

interface PricePayload {
  amount: number;
  description: string;
  type: string;
  courtId: string;
  active: boolean;
}

export const getPrices = async (courtId?: string): Promise<Price[]> => {
  const { data } = await api.get("/prices", { params: { courtId } });
  return data;
};

export const createPrice = async (payload: PricePayload): Promise<Price> => {
  const { data } = await api.post("/prices", payload);
  return data;
};

export const updatePrice = async (id: string, payload: PricePayload): Promise<Price> => {
  const { data } = await api.put(`/prices/${id}`, payload);
  return data;
};

export const deletePrice = async (id: string) => {
  const { data } = await api.delete(`/prices/${id}`);
  return data;
};
