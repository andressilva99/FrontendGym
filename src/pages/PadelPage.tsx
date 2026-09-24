import { useCallback, useEffect, useMemo, useState } from "react";
import { Box, Paper, Typography, Container, Chip, Stack, CircularProgress, Button } from "@mui/material";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import RefreshIcon from "@mui/icons-material/Refresh";
import BackButton from "../components/BackButton";
import DaySelector from "../components/padel/DaySelector";
import TimeSlotGrid from "../components/padel/TimeSlotGrid";
import BookingDialog from "../components/padel/BookingDialog";
import { getTimeSlots } from "../api/timeslots.api";
import type { TimeSlot } from "../types/padel.types";
import { formatDateKey, getErrorMessage, isPadelType, isPastSlot, todayKey } from "../utils/padel.utils";
import { showError } from "../utils/alerts";

export default function PadelPage() {
  const [date, setDate] = useState(todayKey());
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [courtFilter, setCourtFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [selected, setSelected] = useState<TimeSlot | null>(null);

  const loadSlots = useCallback(async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const data = await getTimeSlots({ date, status: "LIBRE" });
      setSlots(data.filter((s) => isPadelType(s.courtId?.type) && !isPastSlot(s)));
    } catch (error) {
      setSlots([]);
      setLoadError(true);
      showError(getErrorMessage(error, "No pudimos cargar los turnos disponibles."));
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    loadSlots();
  }, [loadSlots]);

  const courts = useMemo(() => {
    const map = new Map<string, string>();
    slots.forEach((s) => s.courtId && map.set(s.courtId._id, s.courtId.name));
    return Array.from(map, ([id, name]) => ({ id, name }));
  }, [slots]);

  const visibleSlots = useMemo(
    () => (courtFilter === "ALL" ? slots : slots.filter((s) => s.courtId?._id === courtFilter)),
    [slots, courtFilter]
  );

  const handleDateChange = (value: string) => {
    setDate(value);
    setCourtFilter("ALL");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #023e8a 0%, #0077b6 100%)",
        px: 2,
        py: { xs: 8, sm: 6 },
      }}
    >
      <BackButton to="/" />

      <Container sx={{ maxWidth: "1000px !important", px: { xs: 0, sm: 2 } }}>
        <Paper
          elevation={24}
          sx={{
            borderRadius: { xs: 6, sm: 10 },
            overflow: "hidden",
            bgcolor: "white",
          }}
        >
          {/* ===== BANNER ===== */}
          <Box sx={{ position: "relative", px: { xs: 3, sm: 6 }, py: { xs: 4, sm: 6 }, textAlign: "center" }}>
            <Box
              component="img"
              src="/padel.webp"
              alt="Cancha de Padel"
              decoding="async"
              sx={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
                zIndex: 0,
              }}
            />
            <Box sx={{ position: "absolute", inset: 0, background: "rgba(255, 255, 255, 0.78)", zIndex: 1 }} />

            <Box sx={{ position: "relative", zIndex: 2 }}>
              <Typography
                variant="h3"
                sx={{ fontWeight: 900, color: "#023e8a", mb: 1, fontSize: { xs: "1.8rem", sm: "2.5rem" } }}
              >
                Turnero de Padel
              </Typography>
              <Typography sx={{ fontWeight: 500, color: "#4b5563", fontSize: { xs: "1rem", sm: "1.2rem" } }}>
                Elegí el día y el horario que más te guste y reservá tu cancha en segundos.
              </Typography>
            </Box>
          </Box>

          {/* ===== CONTENIDO ===== */}
          <Box sx={{ p: { xs: 2.5, sm: 5 }, bgcolor: "#f8fbff" }}>
            <Typography sx={{ fontWeight: 800, color: "#023e8a", mb: 1.5, fontSize: 18 }}>1. Elegí el día</Typography>
            <DaySelector value={date} onChange={handleDateChange} />

            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              spacing={1}
              sx={{ mt: 4, mb: 2 }}
            >
              <Box>
                <Typography sx={{ fontWeight: 800, color: "#023e8a", fontSize: 18 }}>2. Elegí tu horario</Typography>
                <Typography sx={{ color: "#6b7280", fontSize: 14 }}>{formatDateKey(date)}</Typography>
              </Box>

              {courts.length > 1 && (
                <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }} useFlexGap>
                  <Chip
                    label="Todas"
                    onClick={() => setCourtFilter("ALL")}
                    color={courtFilter === "ALL" ? "primary" : "default"}
                    sx={{ fontWeight: 700 }}
                  />
                  {courts.map((c) => (
                    <Chip
                      key={c.id}
                      label={c.name}
                      onClick={() => setCourtFilter(c.id)}
                      color={courtFilter === c.id ? "primary" : "default"}
                      sx={{ fontWeight: 700 }}
                    />
                  ))}
                </Stack>
              )}
            </Stack>

            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                <CircularProgress sx={{ color: "#0077b6" }} />
              </Box>
            ) : visibleSlots.length > 0 ? (
              <TimeSlotGrid slots={visibleSlots} onSelect={setSelected} />
            ) : (
              <Box sx={{ textAlign: "center", py: 6, color: "#6b7280" }}>
                <EventBusyIcon sx={{ fontSize: 56, color: "rgba(2, 62, 138, 0.3)" }} />
                <Typography sx={{ fontWeight: 700, mt: 1 }}>
                  {loadError ? "No pudimos cargar los turnos" : "No hay turnos disponibles para este día"}
                </Typography>
                <Typography sx={{ fontSize: 14, mb: 2 }}>
                  {loadError ? "Revisá tu conexión e intentá de nuevo." : "Probá con otra fecha."}
                </Typography>
                {loadError && (
                  <Button startIcon={<RefreshIcon />} onClick={loadSlots} sx={{ fontWeight: 700 }}>
                    Reintentar
                  </Button>
                )}
              </Box>
            )}
          </Box>
        </Paper>
      </Container>

      <BookingDialog slot={selected} onClose={() => setSelected(null)} onBooked={loadSlots} />
    </Box>
  );
}
