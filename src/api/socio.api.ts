import { api } from "./axios";
import type { SocioFormData } from "../types/socio.types";

export const getSocios = async () => {
  const res = await api.get("/socios");
  return res.data;
};

export const createSocio = async (data: SocioFormData) => {
  const res = await api.post("/socios", data);
  return res.data;
};

export const updateSocio = async (id: string, data: SocioFormData) => {
  const res = await api.put(`/socios/${id}`, data);
  return res.data;
};

export const deleteSocio = async (id: string) => {
  const res = await api.delete(`/socios/${id}`);
  return res.data;
};

export const getTrainers = async () => {
  const res = await api.get("/users");
  return res.data;
};