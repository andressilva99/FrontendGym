export type Role = "ADMINISTRATIVO" | "ENTRENADOR";

export interface User {
  _id: string;
  username: string;
  dni: number;
  role: Role;
}