import { Box, Chip, MenuItem, Stack, TextField, Typography } from "@mui/material";
import {
  MONTH_NAMES as MONTHS,
  defaultPeriodRange,
  periodFromToday,
  toPeriod,
  type PeriodRange,
} from "../../utils/period.utils";

const PRESETS: { label: string; get: () => PeriodRange }[] = [
  { label: "Este mes y el anterior", get: defaultPeriodRange },
  { label: "Este mes", get: () => ({ from: periodFromToday(0), to: periodFromToday(0) }) },
  { label: "Mes anterior", get: () => ({ from: periodFromToday(-1), to: periodFromToday(-1) }) },
  { label: "Últimos 3 meses", get: () => ({ from: periodFromToday(-2), to: periodFromToday(0) }) },
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 7 }, (_, i) => currentYear - 5 + i); // 5 años atrás y 1 adelante

const selectSx = { "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: "white" } };

interface PeriodPickerProps {
  label: string;
  value: string;
  error: boolean;
  onChange: (value: string) => void;
}

const PeriodPicker = ({ label, value, error, onChange }: PeriodPickerProps) => {
  const [year, month] = value.split("-").map(Number);
  return (
    <Stack direction="row" spacing={1} alignItems="center" sx={{ flex: 1 }}>
      <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#374151", minWidth: 48 }}>{label}</Typography>
      <TextField
        select
        size="small"
        value={month}
        error={error}
        onChange={(e) => onChange(toPeriod(year, Number(e.target.value)))}
        sx={{ ...selectSx, flex: 1, minWidth: 130 }}
        slotProps={{ htmlInput: { "aria-label": `${label}: mes` } }}
      >
        {MONTHS.map((name, i) => (
          <MenuItem key={name} value={i + 1}>
            {name}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        size="small"
        value={year}
        error={error}
        onChange={(e) => onChange(toPeriod(Number(e.target.value), month))}
        sx={{ ...selectSx, width: 100 }}
        slotProps={{ htmlInput: { "aria-label": `${label}: año` } }}
      >
        {YEARS.map((y) => (
          <MenuItem key={y} value={y}>
            {y}
          </MenuItem>
        ))}
      </TextField>
    </Stack>
  );
};

interface Props {
  value: PeriodRange;
  onChange: (value: PeriodRange) => void;
}

export const PaymentPeriodFilter = ({ value, onChange }: Props) => {
  const invalid = value.from > value.to;

  return (
    <Box sx={{ px: { xs: 2, sm: 3 }, py: 2, borderBottom: "1px solid rgba(0,0,0,0.06)", bgcolor: "#fafbfd" }}>
      <Stack direction={{ xs: "column", lg: "row" }} spacing={1.5} alignItems={{ xs: "stretch", lg: "center" }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ flex: { lg: "0 1 640px" } }}>
          <PeriodPicker label="Desde" value={value.from} error={invalid} onChange={(from) => onChange({ ...value, from })} />
          <PeriodPicker label="Hasta" value={value.to} error={invalid} onChange={(to) => onChange({ ...value, to })} />
        </Stack>

        <Stack direction="row" useFlexGap sx={{ flexWrap: "wrap", gap: 1 }}>
          {PRESETS.map((p) => {
            const preset = p.get();
            const active = preset.from === value.from && preset.to === value.to;
            return (
              <Chip
                key={p.label}
                label={p.label}
                onClick={() => onChange(preset)}
                color={active ? "primary" : "default"}
                variant={active ? "filled" : "outlined"}
                sx={{ fontWeight: 700 }}
              />
            );
          })}
        </Stack>
      </Stack>

      {invalid && (
        <Typography sx={{ mt: 1, fontSize: 13, color: "#d32f2f" }}>
          El mes "desde" tiene que ser anterior o igual al mes "hasta".
        </Typography>
      )}
    </Box>
  );
};
