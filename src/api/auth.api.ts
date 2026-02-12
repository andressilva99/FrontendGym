import { api } from "./axios";
import type { User } from "../types/user.types";

export const loginUser = async (
  dni: number,
  password: string
): Promise<User> => {
  const { data } = await api.post("/auth/login", {
    dni,
    password,
  });

  return data;
};