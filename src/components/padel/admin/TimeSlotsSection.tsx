import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import SectionHeader from "./SectionHeader";
import TimeSlotGeneratorDialog from "./TimeSlotGeneratorDialog";
import DaySelector from "../DaySelector";
import BookingDialog from "../BookingDialog";
import { deleteTimeSlot, getTimeSlots } from "../../../api/timeslots.api";
import { cancelBooking, getBookings } from "../../../api/bookings.api";
import type { Booking, Court, Price, TimeSlot } from "../../../types/padel.types";
import {
  formatDateKey,
  formatMoney,
  getErrorMessage,
  isPastSlot,
  notifyBookingsChanged,
  onBookingsChanged,
  todayKey,
} from "../../../utils/padel.utils";
import { confirmAction, showError, showLoading, showSuccess, showWarning } from "../../../utils/alerts";

interface Props {
  courts: Court[];
  prices: Price[];
}

export default function TimeSlotsSection({ courts, prices }: Props) {
  const [date, setDate] = useState(todayKey());
  const [courtFilter, setCourtFilter] = useState("ALL");
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatorOpen, setGeneratorOpen] = useState(false);
  const [bookingSlot, setBookingSlot] = useState<TimeSlot | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [slotsData, bookingsData] = await Promise.all([getTimeSlots({ date }), getBookings({ date })]);
      setSlots(slotsData);
      setBookings(bookingsData);
    } catch (error) {
      showError(getErrorMessage(error, "No se pudieron cargar los turnos del día."));
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    load();
    return onBookingsChanged(load);
  }, [load]);

  // Cada minuto recalculamos qué turnos ya cerraron para reservar ("Vencido")
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(interval);
  }, []);

  const bookingBySlot = useMemo(() => new Map(bookings.map((b) => [String(b.timeslotId), b])), [bookings]);

  const visibleSlots = useMemo(
    () => (courtFilter === "ALL" ? slots : slots.filter((s) => s.courtId?._id === courtFilter)),
    [slots, courtFilter]
  );

  const freeCount = visibleSlots.filter((s) => s.status === "LIBRE").length;

  const handleDelete = async (slot: TimeSlot) => {
    const confirmed = await confirmAction(
      "¿Eliminar turno?",
      `${slot.courtId?.name ?? "Cancha"} · ${slot.startTime} a ${slot.endTime}`,
      "Sí, eliminar"
    );
    if (!confirmed) return;

    try {
      await deleteTimeSlot(slot._id);
      load();
      showSuccess("Turno eliminado");
    } catch (error) {
      showError(getErrorMessage(error, "No se pudo eliminar el turno."));
    }
  };

  const handleDeleteFree = async () => {
    const free = visibleSlots.filter((s) => s.status === "LIBRE");
    if (free.length === 0) {
      showWarning("No hay turnos libres para eliminar en este día.");
      return;
    }

    const confirmed = await confirmAction(
      `¿Eliminar ${free.length} turnos libres?`,
      `Se borrarán los turnos sin reservar del ${formatDateKey(date)}${courtFilter === "ALL" ? "" : " para la cancha seleccionada"}. Los reservados no se tocan.`,
      "Sí, eliminar"
    );
    if (!confirmed) return;

    showLoading("Eliminando turnos...");
    const results = await Promise.allSettled(free.map((s) => deleteTimeSlot(s._id)));
    const failed = results.filter((r) => r.status === "rejected").length;
    load();

    if (failed > 0) showError(`Se eliminaron ${free.length - failed} turnos, pero ${failed} no se pudieron eliminar.`);
    else showSuccess("¡Turnos eliminados!", `Se eliminaron ${free.length} turnos libres.`);
  };

  const handleCancelBooking = async (booking: Booking) => {
    const confirmed = await confirmAction(
      "¿Cancelar reserva?",
      `${booking.firstName} ${booking.lastName} · ${booking.startTime} a ${booking.endTime}. El turno volverá a quedar libre.`,
      "Sí, cancelar"
    );
    if (!confirmed) return;

    try {
      await cancelBooking(booking._id);
      notifyBookingsChanged();
      showSuccess("Reserva cancelada", "El turno quedó libre nuevamente.");
    } catch (error) {
      showError(getErrorMessage(error, "No se pudo cancelar la reserva."));
    }
  };

  const handleOpenGenerator = () => {
    if (courts.length === 0) {
      showWarning("Primero creá una cancha y un precio para poder generar turnos.");
      return;
    }
    setGeneratorOpen(true);
  };

  return (
    <>
      <SectionHeader
        title="Turnos"
        subtitle={`${formatDateKey(date)} · ${visibleSlots.length} turnos · ${freeCount} libres`}
      >
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteSweepIcon />}
          onClick={handleDeleteFree}
          sx={{ textTransform: "none", borderRadius: 2, whiteSpace: "nowrap" }}
        >
          Eliminar libres
        </Button>
        <Button
          variant="contained"
          startIcon={<AutoAwesomeIcon />}
          onClick={handleOpenGenerator}
          sx={{ bgcolor: "#1877F2", textTransform: "none", borderRadius: 2, whiteSpace: "nowrap" }}
        >
          Generar Turnos
        </Button>
      </SectionHeader>

      <Box sx={{ p: { xs: 2, sm: 3 }, borderBottom: "1px solid #eee", bgcolor: "#fafbfd" }}>
        <DaySelector value={date} onChange={setDate} allowPast />
        {courts.length > 1 && (
          <TextField
            select
            size="small"
            label="Cancha"
            value={courtFilter}
            onChange={(e) => setCourtFilter(e.target.value)}
            sx={{ mt: 2, width: { xs: "100%", sm: 260 }, "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: "white" } }}
          >
            <MenuItem value="ALL">Todas las canchas</MenuItem>
            {courts.map((c) => (
              <MenuItem key={c._id} value={c._id}>
                {c.name}
              </MenuItem>
            ))}
          </TextField>
        )}
      </Box>

      <Box sx={{ overflowX: "auto" }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer sx={{ boxShadow: "none" }}>
            <Table>
              <TableHead sx={{ bgcolor: "#f5f5f5" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Horario</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Cancha</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Precio</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Estado</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Reservado por</TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold" }}>
                    Acciones
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {visibleSlots.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 5, color: "#6b7280" }}>
                      No hay turnos cargados para este día. Usá "Generar Turnos" para crearlos.
                    </TableCell>
                  </TableRow>
                )}
                {visibleSlots.map((s) => {
                  const booking = bookingBySlot.get(s._id);
                  const free = s.status === "LIBRE";
                  const past = isPastSlot(s, now);

                  return (
                    <TableRow key={s._id} hover sx={{ opacity: past && free ? 0.55 : 1 }}>
                      <TableCell sx={{ fontWeight: 800, whiteSpace: "nowrap" }}>
                        {s.startTime} - {s.endTime}
                      </TableCell>
                      <TableCell>{s.courtId?.name ?? "Cancha eliminada"}</TableCell>
                      <TableCell>{formatMoney(s.priceId?.amount)}</TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={free ? (past ? "Vencido" : "Libre") : "Ocupado"}
                          color={free ? (past ? "default" : "success") : "error"}
                          sx={{ fontWeight: 700 }}
                        />
                      </TableCell>
                      <TableCell>
                        {booking ? (
                          <>
                            <Typography sx={{ fontWeight: 600, fontSize: 14 }}>
                              {booking.firstName} {booking.lastName}
                            </Typography>
                            <Typography sx={{ fontSize: 12, color: "#6b7280" }}>WhatsApp {booking.whatsapp}</Typography>
                          </>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                        {free && !past && (
                          <Tooltip title="Reservar este turno">
                            <IconButton color="primary" onClick={() => setBookingSlot(s)}>
                              <EventAvailableIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        {booking && (
                          <Tooltip title="Cancelar reserva">
                            <IconButton color="warning" onClick={() => handleCancelBooking(booking)}>
                              <EventBusyIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        {free && (
                          <Tooltip title="Eliminar turno">
                            <IconButton color="error" onClick={() => handleDelete(s)}>
                              <Delete fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      <TimeSlotGeneratorDialog
        open={generatorOpen}
        initialDate={date < todayKey() ? todayKey() : date}
        courts={courts}
        prices={prices}
        onClose={() => setGeneratorOpen(false)}
        onGenerated={load}
      />

      <BookingDialog
        slot={bookingSlot}
        onClose={() => setBookingSlot(null)}
        onBooked={load}
        redirectOnSuccess="/padel-admin"
      />
    </>
  );
}
