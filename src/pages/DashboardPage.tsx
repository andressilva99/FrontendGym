// src/pages/DashboardPage.tsx
import React from "react";
import { Container, Typography, Paper, Grid } from "@mui/material";
import { People, AccountBalance, Payments, Folder, BarChart } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

interface DashboardItem {
  title: string;
  icon: React.ReactNode;
  path: string;
}

const items: DashboardItem[] = [
  { title: "Usuarios", icon: <People fontSize="large" />, path: "/users" },
  { title: "Socios", icon: <AccountBalance fontSize="large" />, path: "/socios" },
  { title: "Cuotas", icon: <Folder fontSize="large" />, path: "/shares" },
  { title: "Pagos", icon: <Payments fontSize="large" />, path: "/payments" },
  { title: "Reportes", icon: <BarChart fontSize="large" />, path: "/reports" },
];

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Typography variant="h4" mb={4}>
        Panel de Inicio
      </Typography>

      <Grid container spacing={4}>
        {items.map((item) => (
          <Grid
            
            key={item.title}
            component="div" // ⚠️ evita el error de TypeScript
          >
            <Paper
              elevation={3}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                p: 3,
                height: 140,
                cursor: "pointer",
                borderRadius: 3,
                "&:hover": {
                  boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                  transform: "translateY(-3px)",
                  transition: "all 0.3s ease",
                },
              }}
              onClick={() => navigate(item.path)}
            >
              {item.icon}
              <Typography variant="subtitle1" mt={1} fontWeight={600}>
                {item.title}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default DashboardPage;