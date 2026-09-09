import { useNavigate } from "react-router-dom";
import { Box, Paper, Typography, Button, Container, Stack } from "@mui/material";

export default function StartPage() {
  const navigate = useNavigate();

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
      <Container sx={{ maxWidth: "1000px !important" }}>
        <Paper
          elevation={24}
          sx={{
            position: "relative",
            p: { xs: 4, sm: 10, md: 12 },
            borderRadius: 10,
            overflow: "hidden",
            bgcolor: "white",
            minHeight: "350px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            component="img"
            src="/gym.webp"
            alt="Gimnasio Silcor Tech"
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
            {...({ fetchPriority: "high" } as React.ImgHTMLAttributes<HTMLImageElement>)}
            decoding="sync"
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

          <Box
            sx={{
              position: "relative",
              zIndex: 2,
              width: "100%",
              maxWidth: "600px",
              mx: "auto",
              textAlign: "center",
            }}
          >
            <Box mb={8}>
              <Typography
                variant="h1"
                sx={{
                  fontWeight: 950,
                  color: "#023e8a",
                  letterSpacing: -3,
                  mb: 1,
                  fontSize: { xs: "4rem", sm: "5.5rem", md: "6.5rem" },
                  lineHeight: 1,
                }}
              >
                SilCor Tech
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  color: "#4b5563",
                  textTransform: "uppercase",
                  letterSpacing: { xs: 5, sm: 10 },
                  fontSize: { xs: "0.9rem", sm: "1.3rem" },
                }}
              >
                Espacio Deportivo
              </Typography>
            </Box>

            <Stack spacing={4}>
              <Button
                variant="contained"
                onClick={() => navigate("/login")}
                sx={{
                  py: 3,
                  fontWeight: 900,
                  fontSize: "1.3rem",
                  borderRadius: 5,
                  textTransform: "uppercase",
                  background: "linear-gradient(90deg, #023e8a, #0077b6)",
                  boxShadow: "0 15px 35px rgba(2, 62, 138, 0.45)",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 20px 45px rgba(2, 62, 138, 0.55)",
                  },
                }}
              >
                Ingresar como Entrenador
              </Button>

              <Button
                variant="contained"
                onClick={() => navigate("/rutina")}
                sx={{
                  py: 3,
                  fontWeight: 900,
                  fontSize: "1.3rem",
                  borderRadius: 5,
                  textTransform: "uppercase",
                  background: "linear-gradient(90deg, #023e8a, #0077b6)",
                  boxShadow: "0 15px 35px rgba(2, 62, 138, 0.45)",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 20px 45px rgba(2, 62, 138, 0.55)",
                  },
                }}
              >
                Ver Rutina Gym
              </Button>

              <Button
                variant="contained"
                onClick={() => navigate("/padel")}
                sx={{
                  py: 3,
                  fontWeight: 900,
                  fontSize: "1.3rem",
                  borderRadius: 5,
                  textTransform: "uppercase",
                  background: "linear-gradient(90deg, #023e8a, #0077b6)",
                  boxShadow: "0 15px 35px rgba(2, 62, 138, 0.45)",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 20px 45px rgba(2, 62, 138, 0.55)",
                  },
                }}
              >
                Sacar Turno Padel
              </Button>
              
             
            </Stack>
            <Container maxWidth="lg"
            sx={{ py: 4 }}>
              
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#6b7280', 
                  fontWeight: 500,
                  fontSize: { xs: '0.7rem', sm: '0.8rem' } 
                }}
              >
                 © {new Date().getFullYear()} <strong> Andrés Silva | Desarrollador de Software</strong>. Todos los derechos reservados. 
              </Typography>
            </Container>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
