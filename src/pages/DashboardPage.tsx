import React from "react";
import {
  Container,
  Typography,
  Paper,
  Button,
  Box,
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
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      
      {/* Header con bienvenida */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={5}
      >
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Bienvenido, {user.username}
          </Typography>

          <Typography
            variant="subtitle2"
            sx={{
              backgroundColor: "#f0f0f0",
              display: "inline-block",
              px: 2,
              py: 0.5,
              borderRadius: 2,
              mt: 1,
              fontWeight: 500,
            }}
          >
            {user.role}
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="error"
          onClick={onLogout}
        >
          Cerrar sesión
        </Button>
      </Box>

      {/* Contenedor flexible */}
      <Box
        display="flex"
        flexWrap="wrap"
        gap={3}
      >
        {visibleItems.map((item) => (
          <Paper
            key={item.title}
            elevation={3}
            sx={{
              width: {
                xs: "100%",
                sm: "48%",
                md: "30%",
              },
              height: 140,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              borderRadius: 3,
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                transform: "translateY(-4px)",
              },
            }}
            onClick={() => navigate(item.path)}
          >
            {item.icon}
            <Typography mt={1} fontWeight={600}>
              {item.title}
            </Typography>
          </Paper>
        ))}
      </Box>
    </Container>
  );
};

export default DashboardPage;