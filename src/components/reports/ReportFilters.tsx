import { IconButton, MenuItem, Stack, TextField, Tooltip } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import React from "react";
import { MONTH_NAMES } from "../../utils/period.utils";

export interface ReportPeriod {
  year: number;
  month: number; // 1..12
}

interface Props {
  value: ReportPeriod;
  onChange: (value: ReportPeriod) => void;
}

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 7 }, (_, i) => currentYear - 5 + i); // 5 años atrás y 1 adelante

// Selector de mes/año con flechas para pasar al mes anterior o siguiente
const ReportFilters: React.FC<Props> = ({ value, onChange }) => {
  const shift = (delta: number) => {
    const date = new Date(value.year, value.month - 1 + delta, 1);
    onChange({ year: date.getFullYear(), month: date.getMonth() + 1 });
  };

  const fieldSx = { "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: "white" } };

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Tooltip title="Mes anterior">
        <IconButton onClick={() => shift(-1)} sx={{ color: "#1877F2", bgcolor: "rgba(24,119,242,0.06)" }}>
          <ChevronLeftIcon />
        </IconButton>
      </Tooltip>

      <TextField
        select
        size="small"
        value={value.month}
        onChange={(e) => onChange({ ...value, month: Number(e.target.value) })}
        sx={{ ...fieldSx, minWidth: 140, flex: 1 }}
        slotProps={{ htmlInput: { "aria-label": "Mes" } }}
      >
        {MONTH_NAMES.map((name, i) => (
          <MenuItem key={name} value={i + 1}>
            {name}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        size="small"
        value={value.year}
        onChange={(e) => onChange({ ...value, year: Number(e.target.value) })}
        sx={{ ...fieldSx, width: 100 }}
        slotProps={{ htmlInput: { "aria-label": "Año" } }}
      >
        {YEARS.map((y) => (
          <MenuItem key={y} value={y}>
            {y}
          </MenuItem>
        ))}
      </TextField>

      <Tooltip title="Mes siguiente">
        <IconButton onClick={() => shift(1)} sx={{ color: "#1877F2", bgcolor: "rgba(24,119,242,0.06)" }}>
          <ChevronRightIcon />
        </IconButton>
      </Tooltip>
    </Stack>
  );
};

export default ReportFilters;
