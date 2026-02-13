import { useState } from "react";
import {
  Box,
  Paper,
  TextField,
  Typography,
  Button,
  Container,
  Alert,
  InputAdornment,
  Stack,
} from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';

export default function LoginPage({ onLogin }: any) {
  const [dni, setDni] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:3000/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dni: Number(dni), password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Credenciales incorrectas");
        return;
      }
      onLogin(data);
    } catch (err) {
      setError("Error de conexión con el servidor");
    }
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
        py: 4,
      }}
    >
      {/* Agrandamos el maxWidth del Container de md (900px) a lg (1200px) o un valor personalizado */}
      <Container sx={{ maxWidth: "1000px !important" }}> 
        <Paper
          elevation={24}
          sx={{
            position: "relative",
            p: { xs: 4, sm: 10, md: 12 }, // Aumentamos padding para que la card se vea más imponente
            borderRadius: 10, // Un poco más de redondeo para el nuevo tamaño
            overflow: "hidden",
            bgcolor: "white",
            minHeight: "750px", // Aumentamos la altura mínima de la card
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Imagen de Fondo */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'url("/gym.jpg")',
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 0.9,
              zIndex: 0,
            }}
          />

          {/* Overlay suave */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(255, 255, 255, 0.75)", // Un toque más de opacidad blanca por el tamaño
              zIndex: 1,
            }}
          />

          {/* Contenido Centrado */}
          <Box 
            sx={{ 
              position: "relative", 
              zIndex: 2, 
              width: "100%", 
              maxWidth: "600px", // Agrandamos el ancho de los inputs para que no se vean pequeños en la card grande
              mx: "auto", 
              textAlign: "center"
            }}
          >
            <Box mb={8}> {/* Más margen inferior para el título */}
              <Typography
                variant="h1"
                sx={{
                  fontWeight: 950,
                  color: "#023e8a",
                  letterSpacing: -3,
                  mb: 1,
                  fontSize: { xs: "4rem", sm: "5.5rem", md: "6.5rem" }, // Títulos más grandes
                  lineHeight: 1
                }}
              >
                Oxígeno
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

            <Stack spacing={4}> {/* Más espacio entre inputs */}
              <TextField
                label="Número de DNI"
                variant="filled"
                fullWidth
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: "#023e8a", fontSize: "1.8rem" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ 
                  "& .MuiFilledInput-root": { 
                    borderRadius: 4, 
                    bgcolor: "white",
                    boxShadow: "0 6px 15px rgba(0,0,0,0.06)",
                    fontSize: "1.1rem",
                    "&:hover": { bgcolor: "white" },
                    "&.Mui-focused": { bgcolor: "white" }
                  },
                  "& .MuiInputLabel-root": { fontSize: "1.1rem" }
                }}
              />

              <TextField
                label="Contraseña"
                type="password"
                variant="filled"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: "#023e8a", fontSize: "1.8rem" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ 
                  "& .MuiFilledInput-root": { 
                    borderRadius: 4, 
                    bgcolor: "white",
                    boxShadow: "0 6px 15px rgba(0,0,0,0.06)",
                    fontSize: "1.1rem",
                    "&:hover": { bgcolor: "white" },
                    "&.Mui-focused": { bgcolor: "white" }
                  },
                  "& .MuiInputLabel-root": { fontSize: "1.1rem" }
                }}
              />

              {error && (
                <Alert severity="error" variant="filled" sx={{ borderRadius: 3, fontWeight: 700, fontSize: "1rem" }}>
                  {error}
                </Alert>
              )}

              <Button
                variant="contained"
                onClick={handleLogin}
                sx={{
                  mt: 4,
                  py: 3, // Botón más robusto
                  fontWeight: 900,
                  fontSize: "1.5rem",
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
                Iniciar Sesión
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}