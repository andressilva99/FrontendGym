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
      <Container maxWidth="md">
        <Paper
          elevation={24}
          sx={{
            position: "relative",
            p: { xs: 4, sm: 8, md: 10 },
            borderRadius: 8,
            overflow: "hidden",
            bgcolor: "white",
            minHeight: "650px",
            display: "flex",
            alignItems: "center", // Centra verticalmente el contenido
            justifyContent: "center", // Centra horizontalmente el contenido
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

          {/* Overlay suave para mejorar legibilidad en todo el fondo */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(255, 255, 255, 0.7)",
              zIndex: 1,
            }}
          />

          {/* Contenido Centrado */}
          <Box 
            sx={{ 
              position: "relative", 
              zIndex: 2, 
              width: "100%", 
              maxWidth: "550px", // Ancho ideal para los inputs
              mx: "auto", // Centra el bloque de contenido
              textAlign: "center" // Centra todos los textos
            }}
          >
            <Box mb={6}>
              <Typography
                variant="h1"
                sx={{
                  fontWeight: 950,
                  color: "#023e8a",
                  letterSpacing: -2,
                  mb: 1,
                  fontSize: { xs: "3.5rem", sm: "4.5rem", md: "5.5rem" },
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
                  letterSpacing: { xs: 4, sm: 8 },
                  fontSize: { xs: "0.8rem", sm: "1.1rem" },
                }}
              >
                Espacio Deportivo
              </Typography>
            </Box>

            <Stack spacing={3.5}>
              <TextField
                label="Número de DNI"
                variant="filled"
                fullWidth
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: "#023e8a", fontSize: "1.6rem" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ 
                  "& .MuiFilledInput-root": { 
                    borderRadius: 3, 
                    bgcolor: "white",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    "&:hover": { bgcolor: "white" },
                    "&.Mui-focused": { bgcolor: "white" }
                  } 
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
                      <LockIcon sx={{ color: "#023e8a", fontSize: "1.6rem" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ 
                  "& .MuiFilledInput-root": { 
                    borderRadius: 3, 
                    bgcolor: "white",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    "&:hover": { bgcolor: "white" },
                    "&.Mui-focused": { bgcolor: "white" }
                  } 
                }}
              />

              {error && (
                <Alert severity="error" variant="filled" sx={{ borderRadius: 3, fontWeight: 600 }}>
                  {error}
                </Alert>
              )}

              <Button
                variant="contained"
                onClick={handleLogin}
                sx={{
                  mt: 2,
                  py: 2.5,
                  fontWeight: 900,
                  fontSize: "1.3rem",
                  borderRadius: 4,
                  textTransform: "uppercase",
                  background: "linear-gradient(90deg, #023e8a, #0077b6)",
                  boxShadow: "0 12px 30px rgba(2, 62, 138, 0.4)",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: "0 15px 40px rgba(2, 62, 138, 0.5)",
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