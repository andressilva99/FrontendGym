import { api } from "./axios";

import type { Share } from "../types/share.types";

export const getShares = async (): Promise<Share[]> => {
  const { data } = await api.get("/shares");
  return data;
};

export const createShare = async (share: Omit<Share, "_id">) => {
  const { data } = await api.post("/shares", share);
  return data;
};

export const updateShare = async (id: string, share: Partial<Share>) => {
  const { data } = await api.put(`/shares/${id}`, share);
  return data;
};

export const deleteShare = async (id: string) => {
  await api.delete(`/shares/${id}`);
};