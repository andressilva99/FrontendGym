// TURNERO: solo gestiona los turnos y reservas de padel (no es entrenador ni ve reportes)
export type Role = "ADMINISTRATIVO" | "ENTRENADOR" | "TURNERO";

export interface User {
  _id: string;
  username: string;
  dni: number;
  role: Role; 
  token: string;
}