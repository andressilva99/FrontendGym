import { useState } from "react";
import {
  Box,
  Paper,
  TextField,
  Typography,
  Button,
  Container,
  Alert,
} from "@mui/material";

export default function LoginPage({ onLogin }: any) {
  const [dni, setDni] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:3000/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dni: Number(dni),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        return;
      }

      onLogin(data);
    } catch (err) {
      setError("Error de conexión");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #0077b6 0%, #023e8a 100%)",
        px: 2,
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={8}
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: 3,
            backdropFilter: "blur(10px)",
          }}
        >
          {/* Logo / Título */}
          <Box textAlign="center" mb={3}>
            <Typography
              variant="h5"
              fontWeight={800}
              color="#023e8a"
            >
              Oxígeno Espacio Deportivo
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              mt={1}
            >
              Iniciá sesión para continuar
            </Typography>
          </Box>

          {/* Formulario */}
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="DNI"
              variant="outlined"
              fullWidth
              value={dni}
              onChange={(e) => setDni(e.target.value)}
            />

            <TextField
              label="Contraseña"
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && (
              <Alert severity="error">
                {error}
              </Alert>
            )}

            <Button
              variant="contained"
              size="large"
              fullWidth
              sx={{
                mt: 1,
                py: 1.2,
                fontWeight: 700,
                borderRadius: 2,
                background:
                  "linear-gradient(90deg, #0077b6, #023e8a)",
                "&:hover": {
                  opacity: 0.9,
                },
              }}
              onClick={handleLogin}
            >
              Iniciar sesión
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}