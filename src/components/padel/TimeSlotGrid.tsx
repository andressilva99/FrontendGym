import { Box, Typography } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SportsTennisIcon from "@mui/icons-material/SportsTennis";
import type { TimeSlot } from "../../types/padel.types";
import { formatMoney } from "../../utils/padel.utils";

interface Props {
  slots: TimeSlot[];
  onSelect: (slot: TimeSlot) => void;
}

export default function TimeSlotGrid({ slots, onSelect }: Props) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(auto-fill, minmax(170px, 1fr))" },
        gap: { xs: 1.5, sm: 2 },
      }}
    >
      {slots.map((slot) => (
        <Box
          key={slot._id}
          component="button"
          type="button"
          onClick={() => onSelect(slot)}
          sx={{
            textAlign: "left",
            fontFamily: "inherit",
            cursor: "pointer",
            p: { xs: 1.5, sm: 2 },
            borderRadius: 4,
            bgcolor: "white",
            border: "2px solid rgba(0, 119, 182, 0.15)",
            boxShadow: "0 8px 20px rgba(2, 62, 138, 0.06)",
            transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              transform: "translateY(-4px)",
              borderColor: "#0077b6",
              boxShadow: "0 15px 30px rgba(2, 62, 138, 0.2)",
            },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, color: "#023e8a" }}>
            <AccessTimeIcon sx={{ fontSize: 20 }} />
            <Typography sx={{ fontWeight: 900, fontSize: { xs: 18, sm: 20 } }}>{slot.startTime}</Typography>
            <Typography sx={{ color: "#6b7280", fontSize: 13, fontWeight: 600 }}>a {slot.endTime}</Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, mt: 1, color: "#4b5563" }}>
            <SportsTennisIcon sx={{ fontSize: 16 }} />
            <Typography sx={{ fontSize: 13, fontWeight: 600 }} noWrap>
              {slot.courtId?.name ?? "Cancha"}
            </Typography>
          </Box>

          <Typography
            sx={{
              mt: 1.2,
              display: "inline-block",
              px: 1.2,
              py: 0.3,
              borderRadius: 2,
              fontSize: 14,
              fontWeight: 800,
              color: "#0077b6",
              bgcolor: "rgba(0, 119, 182, 0.08)",
            }}
          >
            {formatMoney(slot.priceId?.amount)}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
