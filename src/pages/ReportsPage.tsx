import React, { useState, useEffect } from "react";
import {
  Box,
  CircularProgress,
  Container,
  Typography,
  Stack,
  IconButton,
  Tab,
  Tabs,
  Tooltip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';
import GroupsIcon from "@mui/icons-material/Groups";
import SportsTennisIcon from "@mui/icons-material/SportsTennis";
import ReportFilters, { type ReportPeriod } from "../components/reports/ReportFilters";
import GeneralSummaryTable from "../components/reports/ReportsGeneralSummary";
import TrainerSummaryTable from "../components/reports/ReportTrainerSummary";
import PadelReportSection from "../components/reports/PadelReportSection";
import type { GeneralSummary, TrainerSummary, PadelReport } from "../types/report.types";
import { getPadelReport, getSummaryReport } from "../api/reports.api";
import { getErrorMessage } from "../utils/padel.utils";
import { showError } from "../utils/alerts";
import { MONTH_NAMES } from "../utils/period.utils";

type ReportTab = "cuotas" | "padel";

const currentPeriod = (): ReportPeriod => {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
};

const ReportsPage: React.FC = () => {
  const [general, setGeneral] = useState<GeneralSummary | null>(null);
  const [byTrainer, setByTrainer] = useState<TrainerSummary[]>([]);
  const [padel, setPadel] = useState<PadelReport | null>(null);
  const [period, setPeriod] = useState<ReportPeriod>(currentPeriod);
  const [tab, setTab] = useState<ReportTab>("cuotas");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Cada vez que cambia el mes se cargan los dos reportes (cuotas y padel) en paralelo
  useEffect(() => {
    let cancelled = false;

    const loadReports = async () => {
      setLoading(true);
      const [summary, padelReport] = await Promise.allSettled([
        getSummaryReport(period.year, period.month),
        getPadelReport(period.year, period.month),
      ]);
      if (cancelled) return;

      if (summary.status === "fulfilled") {
        setGeneral(summary.value.general);
        setByTrainer(summary.value.byTrainer);
      } else {
        setGeneral(null);
        setByTrainer([]);
      }
      setPadel(padelReport.status === "fulfilled" ? padelReport.value : null);

      const failed = [summary, padelReport].find((r) => r.status === "rejected") as PromiseRejectedResult | undefined;
      if (failed) {
        showError(getErrorMessage(failed.reason, "No se pudo cargar el reporte del mes."), "Error cargando el reporte");
      }
      setLoading(false);
    };

    loadReports();
    return () => {
      cancelled = true;
    };
  }, [period]);

  const periodLabel = `${MONTH_NAMES[period.month - 1]} ${period.year}`;

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
          px: { xs: 0, sm: 2 },
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
              pt: { xs: 2, sm: 2.5 },
              borderBottom: "1px solid rgba(0,0,0,0.06)",
              background:
                "linear-gradient(180deg, rgba(24,119,242,0.08), rgba(255,255,255,0))",
            }}
          >
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              alignItems={{ xs: "stretch", md: "center" }}
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
                  Reportes
                </Typography>
                <Typography
                  sx={{
                    mt: 0.8,
                    color: "#6b7280",
                    fontSize: { xs: 13, sm: 14 },
                  }}
                >
                  Ingresos de cuotas y turnos de padel de <strong>{periodLabel}</strong>.
                </Typography>
              </Box>

              {/* Selector de mes */}
              <ReportFilters value={period} onChange={setPeriod} />
            </Stack>

            <Tabs
              value={tab}
              onChange={(_, value: ReportTab) => setTab(value)}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              sx={{
                mt: 2,
                "& .MuiTab-root": { textTransform: "none", fontWeight: 700, fontSize: 15, minHeight: 52 },
                "& .Mui-selected": { color: "#1877F2 !important" },
                "& .MuiTabs-indicator": { bgcolor: "#1877F2", height: 3, borderRadius: 3 },
              }}
            >
              <Tab value="cuotas" label="Cuotas del gimnasio" icon={<GroupsIcon />} iconPosition="start" />
              <Tab value="padel" label="Turnos de padel" icon={<SportsTennisIcon />} iconPosition="start" />
            </Tabs>
          </Box>

          {/* ===== CONTENIDO DE LA PESTAÑA ===== */}
          <Box sx={{ p: { xs: 2, sm: 3 }, bgcolor: "#fafbfd" }}>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                <CircularProgress />
              </Box>
            ) : tab === "cuotas" ? (
              <Stack spacing={3}>
                <GeneralSummaryTable data={general} />

                <Box sx={{ p: { xs: 2, sm: 2.5 }, borderRadius: 3, border: "1px solid rgba(0,0,0,0.06)", bgcolor: "#fff" }}>
                  <Typography sx={{ fontWeight: 800, color: "#111827", fontSize: 16 }}>
                    Cobrado por entrenador
                  </Typography>
                  <Typography sx={{ fontSize: 13, color: "#6b7280", mb: 2 }}>
                    Pasá el mouse (o tocá) una porción para ver el monto.
                  </Typography>
                  <TrainerSummaryTable data={byTrainer} general={general} />
                </Box>
              </Stack>
            ) : (
              <PadelReportSection data={padel} />
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ReportsPage;
