import { api } from "./axios";
import type { User } from "../types/user.types";

export const getUsers = async (): Promise<User[]> => {
  const { data } = await api.get("/users");
  return data;
};

export const createUser = (payload: any) =>
  api.post("/users", payload);

export const updateUser = (id: string, payload: any) =>
  api.put(`/users/${id}`, payload);

export const deleteUser = (id: string) =>
  api.delete(`/users/${id}`);