import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

export default function BackButton({ to = "/" }: { to?: string }) {
  const navigate = useNavigate();

  return (
    <Button
      onClick={() => navigate(to)}
      startIcon={<ArrowBackIosNewIcon sx={{ fontSize: "0.9rem !important" }} />}
      sx={{
        position: "fixed",
        top: { xs: 12, sm: 24 },
        left: { xs: 12, sm: 24 },
        zIndex: 20,
        color: "white",
        fontWeight: 700,
        fontSize: { xs: "0.75rem", sm: "0.85rem" },
        textTransform: "uppercase",
        letterSpacing: 1,
        bgcolor: "rgba(255,255,255,0.15)",
        backdropFilter: "blur(6px)",
        borderRadius: 3,
        px: { xs: 1.5, sm: 2.5 },
        py: 1,
        "&:hover": {
          bgcolor: "rgba(255,255,255,0.28)",
        },
      }}
    >
      Volver
    </Button>
  );
}
