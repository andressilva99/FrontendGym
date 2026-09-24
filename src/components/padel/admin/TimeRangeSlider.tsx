import { Box, Chip, Slider, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import { minutesToTime, timeToMinutes } from "../../../utils/padel.utils";

interface Props {
  from: string; // "HH:mm"
  to: string; // "HH:mm" (puede ser "24:00")
  minDistance: number; // minutos: la franja no puede ser más corta que un turno
  onChange: (from: string, to: string) => void;
}

const MIN = 6 * 60;
const MAX = 24 * 60;
const STEP = 30;

const PRESETS = [
  { label: "Mañana", from: "08:00", to: "13:00" },
  { label: "Tarde", from: "14:00", to: "19:00" },
  { label: "Noche", from: "18:00", to: "24:00" },
  { label: "Todo el día", from: "08:00", to: "24:00" },
];

export default function TimeRangeSlider({ from, to, minDistance, onChange }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const value = [timeToMinutes(from), timeToMinutes(to)];

  // Una marca por hora; número cada 2 hs (cada 3 en celu para que no se amontonen)
  const labelEvery = isMobile ? 3 : 2;
  const marks = Array.from({ length: (MAX - MIN) / 60 + 1 }, (_, i) => {
    const minutes = MIN + i * 60;
    const hour = minutes / 60;
    return { value: minutes, label: i % labelEvery === 0 ? String(hour).padStart(2, "0") : undefined };
  });

  const handleChange = (_: Event, newValue: number | number[], activeThumb: number) => {
    if (!Array.isArray(newValue)) return;
    let [start, end] = newValue;

    // Mantiene la distancia mínima empujando la otra perilla
    if (end - start < minDistance) {
      if (activeThumb === 0) {
        start = Math.min(start, MAX - minDistance);
        end = start + minDistance;
      } else {
        end = Math.max(end, MIN + minDistance);
        start = end - minDistance;
      }
    }
    onChange(minutesToTime(start), minutesToTime(end));
  };

  const isPreset = (p: (typeof PRESETS)[number]) => p.from === from && p.to === to;

  return (
    <Box sx={{ p: { xs: 2, sm: 2.5 }, pb: { xs: 1.5, sm: 1.5 }, borderRadius: 3, border: "2px solid rgba(24, 119, 242, 0.35)" }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={1.5}
      >
        <Box>
          <Typography sx={{ fontSize: 13, color: "#4b5563", fontWeight: 600 }}>Franja horaria</Typography>
          <Typography sx={{ fontWeight: 900, fontSize: { xs: 24, sm: 28 }, color: "#111827", lineHeight: 1.2 }}>
            {from}{" "}
            <Box component="span" sx={{ color: "#6b7280", fontWeight: 600 }}>
              a
            </Box>{" "}
            {to}
          </Typography>
        </Box>

        <Stack direction="row" useFlexGap sx={{ flexWrap: "wrap", gap: 1 }}>
          {PRESETS.map((p) => {
            const active = isPreset(p);
            return (
              <Chip
                key={p.label}
                onClick={() => onChange(p.from, p.to)}
                color={active ? "primary" : "default"}
                variant={active ? "filled" : "outlined"}
                label={
                  <>
                    {p.label}{" "}
                    <Box component="span" sx={{ fontWeight: 500, opacity: 0.8 }}>
                      {p.from.slice(0, 2)}–{p.to.slice(0, 2)}
                    </Box>
                  </>
                }
                sx={{ fontWeight: 700, height: 36, borderRadius: 18 }}
              />
            );
          })}
        </Stack>
      </Stack>

      <Box sx={{ px: { xs: 1.5, sm: 1.5 }, pt: 5 }}>
        <Slider
          value={value}
          onChange={handleChange}
          min={MIN}
          max={MAX}
          step={STEP}
          marks={marks}
          disableSwap
          valueLabelDisplay="on"
          valueLabelFormat={(v) => minutesToTime(v)}
          getAriaLabel={(index) => (index === 0 ? "Hora de inicio" : "Hora de fin")}
          getAriaValueText={(v) => minutesToTime(v)}
          sx={{
            color: "#1877F2",
            height: 8,
            "& .MuiSlider-thumb": {
              width: 26,
              height: 26,
              bgcolor: "white",
              border: "3px solid #1877F2",
              boxShadow: "0 4px 12px rgba(24,119,242,0.35)",
              "&:hover, &.Mui-focusVisible": { boxShadow: "0 0 0 8px rgba(24,119,242,0.16)" },
            },
            "& .MuiSlider-rail": { bgcolor: "#d1d5db", opacity: 1 },
            "& .MuiSlider-mark": { bgcolor: "#9ca3af", height: 8, width: 2 },
            "& .MuiSlider-markActive": { bgcolor: "rgba(255,255,255,0.7)" },
            "& .MuiSlider-markLabel": { fontSize: 12, color: "#6b7280", fontWeight: 600 },
            "& .MuiSlider-markLabelActive": { color: "#1877F2" },
            "& .MuiSlider-valueLabel": {
              bgcolor: "#1877F2",
              fontWeight: 700,
              fontSize: 12,
              borderRadius: 1.5,
              py: 0.3,
              px: 0.9,
              top: -8,
            },
          }}
        />
      </Box>

      <Typography sx={{ fontSize: 12, color: "#6b7280" }}>
        Arrastrá las perillas o tocá un atajo. Se mueve de a media hora.
      </Typography>
    </Box>
  );
}
