import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import TimeRangeSlider from "./TimeRangeSlider";
import { createTimeSlot, getTimeSlots } from "../../../api/timeslots.api";
import type { Court, Price, TimeSlotGeneratorData } from "../../../types/padel.types";
import {
  buildDateRange,
  buildTimeRanges,
  formatMoney,
  getErrorMessage,
  minutesToTime,
  timeToMinutes,
  todayKey,
} from "../../../utils/padel.utils";
import { showError, showLoading, showSuccess, showWarning } from "../../../utils/alerts";

interface Props {
  open: boolean;
  initialDate: string;
  courts: Court[];
  prices: Price[];
  onClose: () => void;
  onGenerated: () => void;
}

const MAX_DAYS = 62;

const DURATIONS = [
  { value: 60, label: "1 hora" },
  { value: 90, label: "1:30 hs" },
  { value: 120, label: "2 horas" },
];

const priceCourtId = (p: Price) => (typeof p.courtId === "object" && p.courtId ? p.courtId._id : String(p.courtId));

export default function TimeSlotGeneratorDialog({ open, initialDate, courts, prices, onClose, onGenerated }: Props) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const activeCourts = useMemo(() => courts.filter((c) => c.active), [courts]);

  const [form, setForm] = useState<TimeSlotGeneratorData>({
    courtId: "",
    priceId: "",
    dateFrom: initialDate,
    dateTo: initialDate,
    fromTime: "08:00",
    toTime: "23:00",
    duration: 60,
  });
  const [saving, setSaving] = useState(false);

  const courtPrices = useMemo(
    () => prices.filter((p) => p.active && priceCourtId(p) === form.courtId),
    [prices, form.courtId]
  );

  // Al abrir: preseleccionamos la primera cancha activa y la fecha que el admin estaba mirando
  useEffect(() => {
    if (!open) return;
    const courtId = activeCourts[0]?._id ?? "";
    const firstPrice = prices.find((p) => p.active && priceCourtId(p) === courtId);
    setForm((f) => ({ ...f, courtId, priceId: firstPrice?._id ?? "", dateFrom: initialDate, dateTo: initialDate }));
  }, [open, initialDate, activeCourts, prices]);

  const handleCourtChange = (courtId: string) => {
    const firstPrice = prices.find((p) => p.active && priceCourtId(p) === courtId);
    setForm({ ...form, courtId, priceId: firstPrice?._id ?? "" });
  };

  // Si la franja elegida es más corta que la nueva duración, la estiramos para que entre un turno
  const handleDurationChange = (duration: number) => {
    const from = timeToMinutes(form.fromTime);
    const to = timeToMinutes(form.toTime);
    if (to - from >= duration) {
      setForm({ ...form, duration });
      return;
    }
    const end = Math.min(from + duration, 24 * 60);
    setForm({ ...form, duration, fromTime: minutesToTime(end - duration), toTime: minutesToTime(end) });
  };

  const ranges = useMemo(
    () => (form.fromTime && form.toTime ? buildTimeRanges(form.fromTime, form.toTime, form.duration) : []),
    [form.fromTime, form.toTime, form.duration]
  );

  const dates = useMemo(
    () => (form.dateFrom && form.dateTo && form.dateFrom <= form.dateTo ? buildDateRange(form.dateFrom, form.dateTo) : []),
    [form.dateFrom, form.dateTo]
  );

  const validationError = (() => {
    if (activeCourts.length === 0) return "No hay canchas activas. Creá o activá una en la pestaña Canchas.";
    if (!form.courtId) return "Elegí una cancha.";
    if (courtPrices.length === 0) return "Esta cancha no tiene precios activos. Creá uno en la pestaña Precios.";
    if (!form.priceId) return "Elegí un precio.";
    if (!form.dateFrom || !form.dateTo) return "Completá las fechas.";
    if (form.dateFrom < todayKey()) return "No se pueden crear turnos en fechas pasadas.";
    if (form.dateTo < form.dateFrom) return "La fecha 'hasta' debe ser igual o posterior a 'desde'.";
    if (dates.length > MAX_DAYS) return `Podés generar como máximo ${MAX_DAYS} días por vez.`;
    if (timeToMinutes(form.toTime) <= timeToMinutes(form.fromTime)) return "La hora de fin debe ser posterior a la de inicio.";
    if (ranges.length === 0) return "La franja horaria es más corta que la duración del turno.";
    return null;
  })();

  const handleSubmit = async () => {
    if (validationError) {
      showWarning(validationError);
      return;
    }

    setSaving(true);
    showLoading("Creando turnos...");

    let created = 0;
    let skipped = 0;
    let failed = 0;
    let lastError = "";

    try {
      for (const date of dates) {
        // Evitamos duplicar: salteamos los horarios que se pisan con turnos ya existentes de esa cancha
        const existing = await getTimeSlots({ date, courtId: form.courtId });

        const toCreate = ranges.filter((r) => {
          const start = timeToMinutes(r.startTime);
          const end = timeToMinutes(r.endTime);
          const overlaps = existing.some(
            (s) => start < timeToMinutes(s.endTime) && timeToMinutes(s.startTime) < end
          );
          if (overlaps) skipped++;
          return !overlaps;
        });

        const results = await Promise.allSettled(
          toCreate.map((r) =>
            createTimeSlot({ courtId: form.courtId, priceId: form.priceId, date, startTime: r.startTime, endTime: r.endTime })
          )
        );

        results.forEach((result) => {
          if (result.status === "fulfilled") created++;
          else {
            failed++;
            lastError = getErrorMessage(result.reason, "Error desconocido");
          }
        });
      }
    } catch (error) {
      setSaving(false);
      onGenerated();
      showError(
        `${getErrorMessage(error, "Se interrumpió la carga de turnos.")}${created ? ` Se llegaron a crear ${created} turnos.` : ""}`
      );
      return;
    }

    setSaving(false);
    onGenerated();

    const detail = [
      `Creados: ${created}`,
      skipped ? `Omitidos por superponerse con turnos existentes: ${skipped}` : "",
      failed ? `Con error: ${failed} (${lastError})` : "",
    ]
      .filter(Boolean)
      .join(" · ");

    if (failed > 0) {
      showError(detail, "Algunos turnos no se pudieron crear");
    } else if (created === 0) {
      showWarning(detail, "No se creó ningún turno nuevo");
    } else {
      onClose();
      showSuccess("¡Turnos creados!", detail);
    }
  };

  const selectedPrice = courtPrices.find((p) => p._id === form.priceId);

  return (
    <Dialog
      open={open}
      onClose={saving ? undefined : onClose}
      fullScreen={fullScreen}
      maxWidth="md"
      fullWidth
      disableEnforceFocus
    >
      <DialogTitle sx={{ fontWeight: 700, display: "flex", alignItems: "center", gap: 1 }}>
        <AutoAwesomeIcon sx={{ color: "#1877F2" }} /> Generar turnos
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              select
              label="Cancha"
              value={form.courtId}
              onChange={(e) => handleCourtChange(e.target.value)}
              fullWidth
            >
              {activeCourts.map((c) => (
                <MenuItem key={c._id} value={c._id}>
                  {c.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Precio"
              value={form.priceId}
              onChange={(e) => setForm({ ...form, priceId: e.target.value })}
              disabled={courtPrices.length === 0}
              fullWidth
            >
              {courtPrices.map((p) => (
                <MenuItem key={p._id} value={p._id}>
                  {p.description} · {formatMoney(p.amount)}
                </MenuItem>
              ))}
            </TextField>
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              type="date"
              label="Desde"
              value={form.dateFrom}
              onChange={(e) => setForm({ ...form, dateFrom: e.target.value, dateTo: form.dateTo < e.target.value ? e.target.value : form.dateTo })}
              slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: todayKey() } }}
              fullWidth
            />
            <TextField
              type="date"
              label="Hasta"
              value={form.dateTo}
              onChange={(e) => setForm({ ...form, dateTo: e.target.value })}
              slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: form.dateFrom } }}
              fullWidth
            />
          </Stack>

          <TimeRangeSlider
            from={form.fromTime}
            to={form.toTime}
            minDistance={form.duration}
            onChange={(fromTime, toTime) => setForm({ ...form, fromTime, toTime })}
          />

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems={{ xs: "stretch", sm: "center" }}>
            <Typography sx={{ fontWeight: 700, color: "#374151", minWidth: 180 }}>Duración de cada turno</Typography>
            <ToggleButtonGroup
              exclusive
              value={form.duration}
              onChange={(_, value: number | null) => value && handleDurationChange(value)}
              fullWidth={fullScreen}
              sx={{
                "& .MuiToggleButton-root": { textTransform: "none", fontWeight: 700, px: 2.5, minHeight: 44, color: "#374151" },
                "& .MuiToggleButton-root.Mui-selected": { bgcolor: "#1877F2", color: "white" },
                "& .MuiToggleButton-root.Mui-selected:hover": { bgcolor: "#166fe0" },
              }}
            >
              {DURATIONS.map((d) => (
                <ToggleButton key={d.value} value={d.value}>
                  {d.label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Stack>

          {/* ===== VISTA PREVIA ===== */}
          {validationError ? (
            <Alert severity="warning">{validationError}</Alert>
          ) : (
            <Box sx={{ p: 2, borderRadius: 3, bgcolor: "rgba(24, 119, 242, 0.05)", border: "1px solid rgba(24, 119, 242, 0.15)" }}>
              <Typography sx={{ fontWeight: 800, mb: 1 }}>
                Se van a crear hasta {ranges.length * dates.length} turnos ({ranges.length} por día × {dates.length}{" "}
                {dates.length === 1 ? "día" : "días"}) a {formatMoney(selectedPrice?.amount)}
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8 }}>
                {ranges.map((r) => (
                  <Chip key={r.startTime} size="small" label={`${r.startTime} - ${r.endTime}`} sx={{ fontWeight: 600 }} />
                ))}
              </Box>
              <Typography sx={{ fontSize: 12, color: "#6b7280", mt: 1 }}>
                Los horarios que ya existan para esa cancha se omiten automáticamente.
              </Typography>
            </Box>
          )}
        </Stack>

        <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
          <Button onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={saving || !!validationError}
            sx={{ bgcolor: "#1877F2" }}
          >
            {saving ? "Creando..." : "Generar turnos"}
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
