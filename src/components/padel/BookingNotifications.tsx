import { useCallback, useEffect, useRef, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  Popover,
  Tooltip,
  Typography,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import DoneIcon from "@mui/icons-material/Done";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { getUnseenBookings, markAllBookingsSeen, markBookingSeen } from "../../api/bookings.api";
import type { Booking } from "../../types/padel.types";
import {
  formatMoney,
  formatShortDate,
  getErrorMessage,
  notifyBookingsChanged,
  onBookingsChanged,
} from "../../utils/padel.utils";
import { showError, showToast } from "../../utils/alerts";

const POLL_INTERVAL_MS = 30_000;

export default function BookingNotifications() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [busy, setBusy] = useState(false);
  const lastCount = useRef<number | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await getUnseenBookings();
      setBookings(data.bookings);

      // Solo avisamos si aparecieron reservas nuevas desde la última consulta (no en la carga inicial)
      if (lastCount.current !== null && data.count > lastCount.current) {
        const nuevas = data.count - lastCount.current;
        showToast(nuevas === 1 ? "¡Se reservó un turno nuevo!" : `¡Se reservaron ${nuevas} turnos nuevos!`);
        notifyBookingsChanged();
      }
      lastCount.current = data.count;
    } catch (error) {
      // El polling falla en silencio para no llenar la pantalla de alertas si se corta la conexión
      console.error("Error consultando reservas nuevas:", error);
    }
  }, []);

  useEffect(() => {
    load();
    const interval = window.setInterval(load, POLL_INTERVAL_MS);
    const unsubscribe = onBookingsChanged(load);
    return () => {
      window.clearInterval(interval);
      unsubscribe();
    };
  }, [load]);

  const handleMarkSeen = async (id: string) => {
    setBusy(true);
    try {
      await markBookingSeen(id);
      notifyBookingsChanged();
    } catch (error) {
      showError(getErrorMessage(error, "No se pudo marcar la reserva como leída."));
    } finally {
      setBusy(false);
    }
  };

  const handleMarkAll = async () => {
    setBusy(true);
    try {
      await markAllBookingsSeen();
      notifyBookingsChanged();
      setAnchorEl(null);
      showToast("Todas las reservas quedaron marcadas como leídas", "success");
    } catch (error) {
      showError(getErrorMessage(error, "No se pudieron marcar las reservas como leídas."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Tooltip title="Reservas de padel nuevas">
        <IconButton
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{ color: "#1877F2", bgcolor: "rgba(24, 119, 242, 0.05)" }}
        >
          <Badge badgeContent={bookings.length} color="error" max={99}>
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Tooltip>

      <Popover
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            sx: {
              width: { xs: "calc(100vw - 32px)", sm: 380 },
              maxHeight: 480,
              borderRadius: 3,
              boxShadow: "0 15px 35px rgba(17, 24, 39, 0.15)",
            },
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography sx={{ fontWeight: 800 }}>Reservas nuevas</Typography>
          {bookings.length > 0 && (
            <Button
              size="small"
              startIcon={<DoneAllIcon />}
              onClick={handleMarkAll}
              disabled={busy}
              sx={{ textTransform: "none", fontWeight: 700 }}
            >
              Marcar todas
            </Button>
          )}
        </Box>
        <Divider />

        {bookings.length === 0 ? (
          <Typography sx={{ p: 3, textAlign: "center", color: "#6b7280", fontSize: 14 }}>
            No hay reservas sin leer 🎾
          </Typography>
        ) : (
          bookings.map((b) => (
            <Box
              key={b._id}
              sx={{
                px: 2,
                py: 1.5,
                display: "flex",
                gap: 1,
                alignItems: "flex-start",
                borderBottom: "1px solid rgba(0,0,0,0.06)",
                "&:hover": { bgcolor: "rgba(24, 119, 242, 0.03)" },
              }}
            >
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontWeight: 700, fontSize: 14 }} noWrap>
                  {b.firstName} {b.lastName}
                </Typography>
                <Typography sx={{ fontSize: 13, color: "#4b5563" }}>
                  {b.courtName} · {formatShortDate(b.date)} · {b.startTime} a {b.endTime}
                </Typography>
                <Typography sx={{ fontSize: 12, color: "#6b7280" }}>
                  WhatsApp {b.whatsapp} · {formatMoney(b.paidAmount)}
                </Typography>
              </Box>
              <Tooltip title="Marcar como leída">
                <span>
                  <IconButton size="small" color="primary" onClick={() => handleMarkSeen(b._id)} disabled={busy}>
                    <DoneIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
            </Box>
          ))
        )}
      </Popover>
    </>
  );
}
