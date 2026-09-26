import { useEffect, useRef } from "react";
import { getUnseenBookings } from "../../api/bookings.api";
import { notifyBookingsChanged, onBookingsChanged } from "../../utils/padel.utils";
import { showToast } from "../../utils/alerts";

const POLL_INTERVAL_MS = 30_000;

/*
 * Control global de reservas nuevas (sin parte visual). Se monta UNA sola vez en App.tsx para
 * admin y turnero, así el aviso aparece en cualquier pantalla de la app.
 * - Cada 30s consulta las reservas sin leer.
 * - Si hay más que antes: muestra el aviso.
 * - Si la cantidad cambió: avisa al resto de la app (campana y tablas se recargan solas).
 */
export default function BookingWatcher() {
  const lastCount = useRef<number | null>(null);

  useEffect(() => {
    let active = true;

    // fromPoll: la consulta periódica avisa al resto de la app si hubo cambios. Cuando el aviso
    // viene de otra parte (ej: marcar como leída) solo actualizamos la cuenta, para no hacer un bucle.
    const check = async (fromPoll: boolean) => {
      try {
        const { count } = await getUnseenBookings();
        if (!active) return;

        const previous = lastCount.current;
        lastCount.current = count;
        if (previous === null) return; // carga inicial: no avisamos por las que ya estaban

        if (count > previous) {
          const nuevas = count - previous;
          showToast(nuevas === 1 ? "¡Se reservó un turno nuevo!" : `¡Se reservaron ${nuevas} turnos nuevos!`);
        }
        if (fromPoll && count !== previous) notifyBookingsChanged();
      } catch (error) {
        // Falla en silencio para no llenar la pantalla de alertas si se corta la conexión
        console.error("Error consultando reservas nuevas:", error);
      }
    };

    check(false);
    const interval = window.setInterval(() => check(true), POLL_INTERVAL_MS);
    const unsubscribe = onBookingsChanged(() => check(false));

    return () => {
      active = false;
      window.clearInterval(interval);
      unsubscribe();
    };
  }, []);

  return null;
}
