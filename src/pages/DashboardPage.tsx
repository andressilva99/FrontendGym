import React from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Stack,
} from "@mui/material";
import {
  People,
  AccountBalance,
  Payments,
  Folder,
  BarChart,
  Logout,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import type { User } from "../types/user.types";

interface Props {
  user: User;
  onLogout: () => void;
}

interface DashboardItem {
  title: string;
  icon: React.ReactNode;
  path: string;
  description: string; // Añadimos descripción para llenar más la tarjeta
}

const DashboardPage: React.FC<Props> = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const allItems: DashboardItem[] = [
    { title: "Usuarios", icon: <People sx={{ fontSize: 40 }} />, path: "/users", description: "Gestión de personal" },
    { title: "Socios", icon: <AccountBalance sx={{ fontSize: 40 }} />, path: "/socios", description: "Listado de miembros" },
    { title: "Cuotas", icon: <Folder sx={{ fontSize: 40 }} />, path: "/shares", description: "Planes y precios" },
    { title: "Pagos", icon: <Payments sx={{ fontSize: 40 }} />, path: "/payments", description: "Control de cobros" },
    { title: "Reportes", icon: <BarChart sx={{ fontSize: 40 }} />, path: "/reports", description: "Estadísticas mensuales" },
  ];

  const visibleItems =
    user.role === "ADMINISTRATIVO"
      ? allItems
      : allItems.filter(
          (item) =>
            item.title === "Socios" ||
            item.title === "Pagos"
        );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f5f7fb",
        px: { xs: 1.5, sm: 3, md: 4 },
        py: { xs: 2, sm: 3 },
      }}
    >
      {/* ===== HEADER INSTITUCIONAL ===== */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: { xs: 3, sm: 5 } }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 1.5 } }}>
          <Box
            component="img"
            src="./logo.png"
            alt="Logo"
            sx={{
              width: { xs: 44, sm: 56, md: 64 },
              height: { xs: 44, sm: 56, md: 64 },
              borderRadius: "50%",
              objectFit: "cover",
              boxShadow: "0 4px 12px rgba(24,119,242,0.2)",
            }}
          />
          <Box sx={{ lineHeight: 1 }}>
            <Typography
              sx={{
                fontWeight: 800,
                color: "#1877F2",
                fontSize: { xs: 14, sm: 16 },
                letterSpacing: 0.2,
              }}
            >
              Oxígeno Espacio Deportivo
            </Typography>
            <Typography sx={{ color: "#6b7280", fontSize: 12 }}>
              Sesión activa: {user.username}
            </Typography>
          </Box>
        </Box>

        <Button
          onClick={onLogout}
          startIcon={<Logout />}
          sx={{
            color: "#ef4444",
            textTransform: "none",
            fontWeight: 700,
            "&:hover": { bgcolor: "rgba(239, 68, 68, 0.08)" },
          }}
        >
          Cerrar sesión
        </Button>
      </Stack>

      {/* ===== CUERPO PRINCIPAL ===== */}
      <Container maxWidth={false} sx={{ maxWidth: 2000, mx: "auto" }}>
        <Box
          sx={{
            bgcolor: "white",
            borderRadius: 4,
            boxShadow: "0 10px 30px rgba(17,24,39,0.08)",
            border: "1px solid rgba(0,0,0,0.06)",
            overflow: "hidden",
          }}
        >
          {/* Header de la Card */}
          <Box
            sx={{
              px: { xs: 3, sm: 4 },
              py: { xs: 3, sm: 4 },
              borderBottom: "1px solid rgba(0,0,0,0.06)",
              background: "linear-gradient(180deg, rgba(24,119,242,0.08) 0%, rgba(255,255,255,0) 100%)",
            }}
          >
            <Typography
              sx={{
                fontWeight: 900,
                color: "#111827",
                fontSize: { xs: 28, sm: 36 },
                lineHeight: 1.1,
              }}
            >
              Panel de Inicio
            </Typography>
            <Typography sx={{ mt: 1, color: "#6b7280", fontSize: { xs: 15, sm: 17 } }}>
              Bienvenido al sistema de gestión. Seleccioná una sección para comenzar.
            </Typography>
          </Box>

          {/* Grid de Botones/Cards */}
          <Box
            sx={{
              p: { xs: 2, sm: 4 },
              display: "flex",
              flexWrap: "wrap",
              gap: 3,
              justifyContent: "center",
            }}
          >
            {visibleItems.map((item) => (
              <Paper
                key={item.title}
                elevation={0}
                onClick={() => navigate(item.path)}
                sx={{
                  width: { xs: "100%", sm: "calc(50% - 24px)", md: "calc(33.33% - 24px)", lg: "calc(20% - 24px)" },
                  minHeight: 200,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  p: 3,
                  cursor: "pointer",
                  borderRadius: 4,
                  // Contorno y sombreado azul leve solicitado
                  border: "2px solid rgba(24, 119, 242, 0.12)",
                  bgcolor: "#fff",
                  boxShadow: "0 8px 20px rgba(24, 119, 242, 0.05)",
                  transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    borderColor: "rgba(24, 119, 242, 0.4)",
                    boxShadow: "0 15px 35px rgba(24, 119, 242, 0.15)",
                    bgcolor: "rgba(24, 119, 242, 0.01)",
                  },
                }}
              >
                <Box
                  sx={{
                    width: 70,
                    height: 70,
                    borderRadius: 3,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "rgba(24, 119, 242, 0.08)",
                    color: "#1877F2",
                    mb: 2.5,
                    transition: "all 0.3s ease",
                  }}
                >
                  {item.icon}
                </Box>

                <Typography
                  sx={{
                    fontWeight: 800,
                    fontSize: 20,
                    color: "#111827",
                    textAlign: "center",
                  }}
                >
                  {item.title}
                </Typography>
                
                <Typography
                  sx={{
                    fontSize: 13,
                    color: "#6b7280",
                    textAlign: "center",
                    mt: 0.5,
                  }}
                >
                  {item.description}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default DashboardPage;