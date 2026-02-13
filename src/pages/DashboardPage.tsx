import React from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
} from "@mui/material";
import {
  People,
  AccountBalance,
  Payments,
  Folder,
  BarChart,
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
}

const DashboardPage: React.FC<Props> = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const allItems: DashboardItem[] = [
    { title: "Usuarios", icon: <People fontSize="large" />, path: "/users" },
    { title: "Socios", icon: <AccountBalance fontSize="large" />, path: "/socios" },
    { title: "Cuotas", icon: <Folder fontSize="large" />, path: "/shares" },
    { title: "Pagos", icon: <Payments fontSize="large" />, path: "/payments" },
    { title: "Reportes", icon: <BarChart fontSize="large" />, path: "/reports" },
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
        bgcolor: "#f3f4f6",
        py: { xs: 2, sm: 3 },
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          maxWidth: 2000,
          mx: "auto",
          px: { xs: 2, sm: 3 },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: { xs: 2, sm: 3 },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
            <Box
              component="img"
              src="/logo.png"
              alt="Logo"
              sx={{
                width: { xs: 46, sm: 56 },
                height: { xs: 46, sm: 56 },
                borderRadius: "50%",
                objectFit: "cover",
                bgcolor: "#fff",
                border: "1px solid rgba(2, 62, 138, .12)",
                boxShadow: "0 10px 22px rgba(2, 62, 138, .10)",
              }}
            />

            <Box>
              <Typography
                sx={{
                  fontWeight: 800,
                  color: "#0b3b8c",
                  fontSize: { xs: 13, sm: 15 },
                  lineHeight: 1.1,
                }}
              >
                Oxígeno Espacio Deportivo
              </Typography>

              <Typography
                sx={{
                  fontSize: 12,
                  color: "#6b7280",
                }}
              >
                Bienvenido, {user.username} — {user.role}
              </Typography>
            </Box>
          </Box>

          <Button
            variant="contained"
            color="error"
            onClick={onLogout}
          >
            Cerrar sesión
          </Button>
        </Box>

        {/* Card principal */}
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            borderRadius: 2,
            border: "1px solid #e5e7eb",
            bgcolor: "#fff",
            overflow: "hidden",
            boxShadow: "0 16px 30px rgba(15, 23, 42, .08)",
          }}
        >
          {/* Título */}
          <Box
            sx={{
              px: { xs: 2, sm: 3 },
              py: { xs: 2, sm: 2.5 },
              borderBottom: "1px solid #eef2f7",
              background:
                "linear-gradient(180deg, rgba(173,232,244,.40) 0%, rgba(255,255,255,1) 70%)",
            }}
          >
            <Typography
              sx={{
                fontWeight: 900,
                fontSize: { xs: 22, sm: 28 },
                color: "#111827",
              }}
            >
              Panel de inicio
            </Typography>

            <Typography
              sx={{
                mt: 0.5,
                color: "#6b7280",
                fontSize: { xs: 13, sm: 14 },
              }}
            >
              Elegí una sección para continuar.
            </Typography>
          </Box>

          {/* Botones sin Grid */}
          <Box
            sx={{
              p: { xs: 2, sm: 3 },
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: { xs: 2, sm: 2.5 },
            }}
          >
            {visibleItems.map((item) => (
              <Box
                key={item.title}
                sx={{
                  width: {
                    xs: "100%",
                    sm: "48%",
                    md: "31%",
                    lg: "18%",
                  },
                  display: "flex",
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    width: "100%",
                    minHeight: { xs: 140, sm: 165 },
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                    p: 2.5,
                    cursor: "pointer",
                    borderRadius: 3,
                    border: "1px solid rgba(2, 62, 138, .22)",
                    boxShadow: "0 10px 22px rgba(2, 62, 138, .10)",
                    transition:
                      "transform .15s ease, box-shadow .15s ease, border-color .15s ease",
                    "&:hover": {
                      transform: "translateY(-3px)",
                      borderColor: "rgba(2, 62, 138, .35)",
                      boxShadow: "0 16px 30px rgba(2, 62, 138, .14)",
                    },
                  }}
                  onClick={() => navigate(item.path)}
                >
                  <Box
                    sx={{
                      width: 58,
                      height: 58,
                      borderRadius: 2,
                      display: "grid",
                      placeItems: "center",
                      bgcolor: "rgba(0, 119, 182, .10)",
                      color: "#023e8a",
                    }}
                  >
                    {item.icon}
                  </Box>

                  <Typography
                    variant="subtitle1"
                    sx={{
                      mt: 0.5,
                      fontWeight: 800,
                      color: "#111827",
                    }}
                  >
                    {item.title}
                  </Typography>
                </Paper>
              </Box>
            ))}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default DashboardPage;