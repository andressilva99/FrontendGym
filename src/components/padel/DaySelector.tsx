import { Box, Stack, TextField, Typography } from "@mui/material";
import { addDaysToKey, formatDateKey, todayKey } from "../../utils/padel.utils";

interface Props {
  value: string; // YYYY-MM-DD
  onChange: (value: string) => void;
  days?: number;
  allowPast?: boolean;
}

export default function DaySelector({ value, onChange, days = 14, allowPast = false }: Props) {
  const today = todayKey();
  const options = Array.from({ length: days }, (_, i) => addDaysToKey(today, i));

  return (
    <Stack spacing={1.5}>
      <Box
        sx={{
          display: "flex",
          gap: 1.2,
          overflowX: "auto",
          pb: 1,
          scrollbarWidth: "thin",
        }}
      >
        {options.map((key) => {
          const selected = key === value;
          return (
            <Box
              key={key}
              component="button"
              type="button"
              onClick={() => onChange(key)}
              sx={{
                flex: "0 0 auto",
                minWidth: 72,
                py: 1.2,
                px: 1,
                borderRadius: 3,
                cursor: "pointer",
                fontFamily: "inherit",
                border: selected ? "2px solid #0077b6" : "2px solid rgba(0, 119, 182, 0.15)",
                background: selected ? "linear-gradient(135deg, #023e8a, #0077b6)" : "white",
                color: selected ? "white" : "#023e8a",
                boxShadow: selected ? "0 8px 20px rgba(2, 62, 138, 0.35)" : "none",
                transition: "all 0.2s ease",
                "&:hover": { borderColor: "#0077b6", transform: "translateY(-2px)" },
              }}
            >
              <Typography sx={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", opacity: 0.85 }}>
                {key === today ? "Hoy" : formatDateKey(key, { weekday: "short" })}
              </Typography>
              <Typography sx={{ fontSize: 22, fontWeight: 900, lineHeight: 1.1 }}>
                {formatDateKey(key, { day: "numeric" })}
              </Typography>
              <Typography sx={{ fontSize: 11, fontWeight: 600, opacity: 0.85 }}>
                {formatDateKey(key, { month: "short" })}
              </Typography>
            </Box>
          );
        })}
      </Box>

      <TextField
        type="date"
        size="small"
        label="Otra fecha"
        value={value}
        onChange={(e) => e.target.value && onChange(e.target.value)}
        slotProps={{
          inputLabel: { shrink: true },
          htmlInput: allowPast ? undefined : { min: today },
        }}
        sx={{ width: { xs: "100%", sm: 220 }, "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: "white" } }}
      />
    </Stack>
  );
}
