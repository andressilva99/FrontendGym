import BookingNotifications from "./BookingNotifications";
import type { User } from "../../types/user.types";

// Lee el usuario de la sesión guardada al iniciar sesión (App.tsx la guarda en localStorage)
const getSessionUser = (): User | null => {
  try {
    const stored = localStorage.getItem("user");
    return stored ? (JSON.parse(stored) as User) : null;
  } catch {
    return null;
  }
};

/*
 * Campana de reservas nuevas para el encabezado de las pantallas que no reciben el usuario por props
 * (Usuarios, Socios, Cuotas, Pagos, Reportes). Solo se muestra al administrativo y al turnero:
 * el entrenador también entra a Socios y Pagos, y no debe verla.
 */
export default function HeaderBookingBell() {
  const user = getSessionUser();
  if (user?.role !== "ADMINISTRATIVO" && user?.role !== "TURNERO") return null;
  return <BookingNotifications />;
}
