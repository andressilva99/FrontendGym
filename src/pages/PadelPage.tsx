import { Box, Paper, Typography, Container } from "@mui/material";
import BackButton from "../components/BackButton";

export default function PadelPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #023e8a 0%, #0077b6 100%)",
        px: 2,
        py: 4,
      }}
    >
      <BackButton to="/" />

      <Container sx={{ maxWidth: "700px !important" }}>
        <Paper
          elevation={24}
          sx={{
            position: "relative",
            p: { xs: 4, sm: 8, md: 10 },
            borderRadius: 10,
            overflow: "hidden",
            bgcolor: "white",
            textAlign: "center",
          }}
        >
          <Box
            component="img"
            src="/padel.webp"
            alt="Cancha de Padel Silcor Tech"
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              opacity: 0.9,
              zIndex: 0,
            }}
            decoding="async"
          />

          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(255, 255, 255, 0.75)",
              zIndex: 1,
            }}
          />

          <Box sx={{ position: "relative", zIndex: 2 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                color: "#023e8a",
                mb: 2,
                fontSize: { xs: "1.8rem", sm: "2.5rem" },
              }}
            >
              Turnero de Padel
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 500,
                color: "#4b5563",
                fontSize: { xs: "1rem", sm: "1.2rem" },
              }}
            >
              Próximamente vas a poder reservar tu turno desde acá.
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
