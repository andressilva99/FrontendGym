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

// Usuarios que se pueden asignar como entrenador de un socio: todos menos los turneros
// (se filtra acá y no en el back porque /users también lista a todos en la pantalla Usuarios)
export const getTrainers = async () => {
  const res = await api.get("/users");
  return res.data.filter((u: { role?: string }) => u.role !== "TURNERO");
};