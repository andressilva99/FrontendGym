import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Chip,
  CircularProgress,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Stack,
  Switch,
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
import SearchIcon from "@mui/icons-material/Search";
import DoneIcon from "@mui/icons-material/Done";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import SectionHeader from "./SectionHeader";
import { cancelBooking, getBookings, markBookingSeen } from "../../../api/bookings.api";
import type { Booking } from "../../../types/padel.types";
import {
  addDaysToKey,
  clientName,
  formatDateKey,
  formatMoney,
  formatShortDate,
  getErrorMessage,
  notifyBookingsChanged,
  onBookingsChanged,
  toDateKey,
  todayKey,
} from "../../../utils/padel.utils";

const formatShortDateKey = (key: string) => (key ? formatDateKey(key, { day: "2-digit", month: "2-digit" }) : "-");
import { confirmAction, showError, showSuccess } from "../../../utils/alerts";

// Vista por defecto: 3 días para atrás y 7 para adelante desde hoy
const defaultRange = () => ({ from: addDaysToKey(todayKey(), -3), to: addDaysToKey(todayKey(), 7) });

const monthRange = (offset: number) => {
  const now = new Date();
  const first = new Date(now.getFullYear(), now.getMonth() + offset, 1);
  const last = new Date(now.getFullYear(), now.getMonth() + offset + 1, 0);
  return { from: toDateKey(first), to: toDateKey(last) };
};

const RANGE_PRESETS = [
  { label: "Próximos días", get: defaultRange },
  { label: "Este mes", get: () => monthRange(0) },
  { label: "Mes anterior", get: () => monthRange(-1) },
];

export default function BookingsSection() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState(defaultRange);
  const [search, setSearch] = useState("");
  const [onlyUnseen, setOnlyUnseen] = useState(false);

  const invalidRange = !range.from || !range.to || range.from > range.to;

  const load = useCallback(async () => {
    if (invalidRange) return;
    setLoading(true);
    try {
      setBookings(await getBookings({ from: range.from, to: range.to }));
    } catch (error) {
      showError(getErrorMessage(error, "No se pudieron cargar las reservas."));
    } finally {
      setLoading(false);
    }
  }, [range, invalidRange]);

  useEffect(() => {
    load();
    return onBookingsChanged(load);
  }, [load]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return bookings.filter((b) => {
      if (onlyUnseen && b.seenByAdmin) return false;
      if (!term) return true;
      return (
        `${b.firstName} ${b.lastName}`.toLowerCase().includes(term) ||
        String(b.dni).includes(term) ||
        b.email.toLowerCase().includes(term) ||
        b.courtName.toLowerCase().includes(term)
      );
    });
  }, [bookings, search, onlyUnseen]);

  const total = filtered.reduce((acc, b) => acc + (b.paidAmount || 0), 0);
  const unseenCount = bookings.filter((b) => !b.seenByAdmin).length;

  const handleMarkSeen = async (id: string) => {
    try {
      await markBookingSeen(id);
      notifyBookingsChanged();
    } catch (error) {
      showError(getErrorMessage(error, "No se pudo marcar la reserva como leída."));
    }
  };

  const handleCancel = async (b: Booking) => {
    const confirmed = await confirmAction(
      "¿Cancelar reserva?",
      `${clientName(b)} · ${b.courtName} · ${formatShortDate(b.date)} ${b.startTime} hs. El turno volverá a quedar libre.`,
      "Sí, cancelar"
    );
    if (!confirmed) return;

    try {
      await cancelBooking(b._id);
      notifyBookingsChanged();
      showSuccess("Reserva cancelada", "El turno quedó libre nuevamente.");
    } catch (error) {
      showError(getErrorMessage(error, "No se pudo cancelar la reserva."));
    }
  };

  return (
    <>
      <SectionHeader
        title="Reservas"
        subtitle={`${formatShortDateKey(range.from)} al ${formatShortDateKey(range.to)} · ${filtered.length} reservas · ${unseenCount} sin leer · Total ${formatMoney(total)}`}
      >
        <TextField
          placeholder="Buscar cliente, DNI, email..."
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: { xs: "100%", sm: 260 }, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#999" }} />
                </InputAdornment>
              ),
            },
          }}
        />
        <FormControlLabel
          control={<Switch checked={onlyUnseen} onChange={(e) => setOnlyUnseen(e.target.checked)} />}
          label="Solo sin leer"
          sx={{ whiteSpace: "nowrap" }}
        />
      </SectionHeader>

      {/* ===== BUSCADOR ENTRE FECHAS ===== */}
      <Box sx={{ px: { xs: 2, sm: 3 }, py: 2, borderBottom: "1px solid #eee", bgcolor: "#fafbfd" }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} alignItems={{ xs: "stretch", md: "center" }}>
          <Stack direction="row" spacing={1.5}>
            <TextField
              type="date"
              size="small"
              label="Turnos desde"
              value={range.from}
              onChange={(e) => setRange({ ...range, from: e.target.value })}
              error={invalidRange}
              slotProps={{ inputLabel: { shrink: true } }}
              sx={{ flex: 1, minWidth: { sm: 170 }, "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: "white" } }}
            />
            <TextField
              type="date"
              size="small"
              label="Hasta"
              value={range.to}
              onChange={(e) => setRange({ ...range, to: e.target.value })}
              error={invalidRange}
              slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: range.from } }}
              sx={{ flex: 1, minWidth: { sm: 170 }, "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: "white" } }}
            />
          </Stack>
          <Stack direction="row" useFlexGap sx={{ flexWrap: "wrap", gap: 1 }}>
            {RANGE_PRESETS.map((p) => {
              const preset = p.get();
              const active = preset.from === range.from && preset.to === range.to;
              return (
                <Chip
                  key={p.label}
                  label={p.label}
                  onClick={() => setRange(preset)}
                  color={active ? "primary" : "default"}
                  variant={active ? "filled" : "outlined"}
                  sx={{ fontWeight: 700 }}
                />
              );
            })}
          </Stack>
        </Stack>
        {invalidRange && (
          <Typography sx={{ mt: 1, fontSize: 13, color: "#d32f2f" }}>
            La fecha "desde" tiene que ser anterior o igual a "hasta".
          </Typography>
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
                  <TableCell sx={{ fontWeight: "bold" }}>Turno</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Cancha</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Cliente</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Contacto</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Monto</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Reservado el</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Estado</TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold" }}>
                    Acciones
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 5, color: "#6b7280" }}>
                      No hay reservas para mostrar.
                    </TableCell>
                  </TableRow>
                )}
                {filtered.map((b) => (
                  <TableRow
                    key={b._id}
                    hover
                    sx={{ bgcolor: b.seenByAdmin ? undefined : "rgba(24, 119, 242, 0.04)" }}
                  >
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      <Typography sx={{ fontWeight: 800, fontSize: 14 }}>{formatShortDate(b.date)}</Typography>
                      <Typography sx={{ fontSize: 13, color: "#4b5563" }}>
                        {b.startTime} - {b.endTime}
                      </Typography>
                    </TableCell>
                    <TableCell>{b.courtName}</TableCell>
                    <TableCell>
                      <Typography sx={{ fontWeight: 600, fontSize: 14 }}>
                        {clientName(b)}
                      </Typography>
                      <Typography sx={{ fontSize: 12, color: "#6b7280" }}>DNI {b.dni}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: 13 }}>{b.email}</Typography>
                      <Typography sx={{ fontSize: 12, color: "#6b7280" }}>WhatsApp {b.whatsapp}</Typography>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#1877F2" }}>{formatMoney(b.paidAmount)}</TableCell>
                    <TableCell sx={{ fontSize: 13, whiteSpace: "nowrap" }}>
                      {new Date(b.bookingDate).toLocaleString("es-AR", { dateStyle: "short", timeStyle: "short" })}
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={b.seenByAdmin ? "Leída" : "Nueva"}
                        color={b.seenByAdmin ? "default" : "primary"}
                        sx={{ fontWeight: 700 }}
                      />
                    </TableCell>
                    <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                      {!b.seenByAdmin && (
                        <Tooltip title="Marcar como leída">
                          <IconButton color="primary" onClick={() => handleMarkSeen(b._id)}>
                            <DoneIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Cancelar reserva">
                        <IconButton color="error" onClick={() => handleCancel(b)}>
                          <EventBusyIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </>
  );
}
