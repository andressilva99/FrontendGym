import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Stack,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';
import ReportFilters from "../components/reports/ReportFilters";
import GeneralSummaryTable from "../components/reports/ReportsGeneralSummary";
import TrainerSummaryTable from "../components/reports/ReportTrainerSummary";
import type { GeneralSummary, TrainerSummary, ReportResponse } from "../types/report.types";
import { api } from "../api/axios";

const ReportsPage: React.FC = () => {
  const [general, setGeneral] = useState<GeneralSummary | null>(null);
  const [byTrainer, setByTrainer] = useState<TrainerSummary[]>([]);
  
  const navigate = useNavigate();

  const loadReport = async (year: number, month: number) => {
    try {
      const res = await api.get<ReportResponse>("/reports/summary", {
        params: { year, month },
      });

      setGeneral(res.data.general);
      setByTrainer(res.data.byTrainer);
    } catch (err) {
      console.error(err);
      alert("Error cargando el reporte");
    }
  };

  useEffect(() => {
    const now = new Date();
    loadReport(now.getFullYear(), now.getMonth() + 1);
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f5f7fb",
        px: { xs: 1.5, sm: 3, md: 4 },
        py: { xs: 2, sm: 3 },
      }}
    >
      {/* ===== HEADER (Logo + Marca + Botón Home) ===== */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between", // Empuja el Home a la derecha
          mb: { xs: 2, sm: 3 },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 1.5 } }}>
          <Box
            component="img"
            src="/logo.png"
            alt="Logo"
            sx={{
              width: { xs: 44, sm: 56, md: 64 },
              height: { xs: 44, sm: 56, md: 64 },
              borderRadius: "50%",
              objectFit: "cover",
              boxShadow: "0 4px 12px rgba(24,119,242,0.15)",
            }}
          />
          <Box sx={{ lineHeight: 1 }}>
            <Typography
              sx={{
                fontWeight: 800,
                color: "#1877F2",
                fontSize: { xs: 12, sm: 14, md: 16 },
                letterSpacing: 0.2,
              }}
            >
              Oxígeno Espacio Deportivo
            </Typography>
          </Box>
        </Box>

        {/* Botón Home alineado a la derecha */}
        <Tooltip title="Ir al Dashboard">
          <IconButton 
            onClick={() => navigate("/")}
            sx={{ 
              color: "#1877F2", 
              bgcolor: "rgba(24, 119, 242, 0.05)",
              border: "1px solid rgba(24, 119, 242, 0.1)",
              "&:hover": { 
                bgcolor: "rgba(24, 119, 242, 0.12)",
                transform: "scale(1.05)"
              },
              transition: "all 0.2s"
            }}
          >
            <HomeIcon sx={{ fontSize: { xs: 24, sm: 28, md: 32 } }} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* ===== CONTENIDO PRINCIPAL ===== */}
      <Container
        maxWidth={false}
        sx={{
          maxWidth: 2000,
          mx: "auto",
          mt: { xs: 1, sm: 1.5, md: 2 },
        }}
      >
        <Box
          sx={{
            bgcolor: "white",
            borderRadius: 3,
            boxShadow: "0 10px 30px rgba(17,24,39,0.08)",
            border: "1px solid rgba(0,0,0,0.06)",
            overflow: "hidden",
          }}
        >
          {/* Header de la Card con Gradiente */}
          <Box
            sx={{
              px: { xs: 2, sm: 3 },
              py: { xs: 2, sm: 2.5 },
              borderBottom: "1px solid rgba(0,0,0,0.06)",
              background:
                "linear-gradient(180deg, rgba(24,119,242,0.08), rgba(255,255,255,0))",
            }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              alignItems={{ xs: "stretch", sm: "center" }}
              justifyContent="space-between"
            >
              <Box>
                <Typography
                  sx={{
                    fontWeight: 900,
                    color: "#111827",
                    fontSize: { xs: 26, sm: 32, md: 36 },
                    lineHeight: 1.05,
                  }}
                >
                  Resumen de Pagos
                </Typography>
                <Typography
                  sx={{
                    mt: 0.8,
                    color: "#6b7280",
                    fontSize: { xs: 13, sm: 14 },
                  }}
                >
                  Visualizá los ingresos totales y el desglose por entrenadores.
                </Typography>
              </Box>

              {/* Los filtros integrados en la cabecera */}
              <Box>
                <ReportFilters onLoad={loadReport} />
              </Box>
            </Stack>
          </Box>

          {/* Sección de Tablas */}
          <Box sx={{ p: { xs: 2, sm: 3 } }}>
            <Stack spacing={4}>
              {/* Resumen General */}
              <Box>
                <Typography 
                  variant="h6" 
                  sx={{ fontWeight: 700, mb: 2, color: "#374151" }}
                >
                  Resumen Mensual General
                </Typography>
                <Box sx={{ overflowX: "auto" }}>
                  <GeneralSummaryTable data={general} />
                </Box>
              </Box>

              <Divider />

              {/* Detalle por Entrenador */}
              <Box>
                <Typography 
                  variant="h6" 
                  sx={{ fontWeight: 700, mb: 2, color: "#374151" }}
                >
                  Desglose por Entrenadores
                </Typography>
                <Box sx={{ overflowX: "auto" }}>
                  <TrainerSummaryTable data={byTrainer} />
                </Box>
              </Box>
            </Stack>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ReportsPage;