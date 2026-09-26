import { Box, Typography } from "@mui/material";

interface Props {
  label: string;
  value: string;
  hint?: string;
  icon?: React.ReactNode;
  // Barra de progreso opcional (0-100), ej: % cobrado u ocupación
  progress?: number;
}

// Tarjeta de indicador (KPI): etiqueta, número grande y un detalle opcional
export default function StatTile({ label, value, hint, icon, progress }: Props) {
  return (
    <Box
      sx={{
        flex: "1 1 200px",
        minWidth: 0,
        p: { xs: 2, sm: 2.5 },
        borderRadius: 3,
        bgcolor: "#fff",
        border: "1px solid rgba(24, 119, 242, 0.12)",
        boxShadow: "0 8px 20px rgba(24, 119, 242, 0.05)",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "#6b7280" }}>
        {icon && (
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "rgba(24, 119, 242, 0.08)",
              color: "#1877F2",
            }}
          >
            {icon}
          </Box>
        )}
        <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{label}</Typography>
      </Box>

      <Typography
        sx={{
          mt: 1,
          fontWeight: 900,
          color: "#111827",
          fontSize: { xs: 24, sm: 28 },
          lineHeight: 1.1,
          fontVariantNumeric: "tabular-nums",
          wordBreak: "break-word",
        }}
      >
        {value}
      </Typography>

      {progress !== undefined && (
        <Box
          role="meter"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
          aria-label={label}
          sx={{ mt: 1.5, height: 8, borderRadius: 4, bgcolor: "#e5e7eb", overflow: "hidden" }}
        >
          <Box sx={{ width: `${Math.min(progress, 100)}%`, height: "100%", borderRadius: 4, bgcolor: "#2a78d6" }} />
        </Box>
      )}

      {hint && <Typography sx={{ mt: 1, fontSize: 13, color: "#6b7280" }}>{hint}</Typography>}
    </Box>
  );
}
