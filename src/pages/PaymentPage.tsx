import { useEffect, useState, useMemo } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
  useMediaQuery,
  useTheme,
  Stack,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import {
  getPayments,
  generatePayments,
  togglePayment,
  updatePaymentShare,
} from "../api/payment.api";
import { api } from "../api/axios";
import type {
  Payment,
  Share,
  Socio,
} from "../types/payment.types";
import { PaymentGenerateForm } from "../components/payment/PaymentGenerateForm";
import { PaymentTable } from "../components/payment/PaymentTable";

export const PaymentsPage = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [shares, setShares] = useState<Share[]>([]);
  const [socios, setSocios] = useState<Socio[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortAsc, setSortAsc] = useState(false); // Estado para el orden de fecha
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const loadData = async () => {
    try {
      const [paymentsData, sharesRes, sociosRes] = await Promise.all([
        getPayments(),
        api.get("/shares"),
        api.get("/socios"),
      ]);
      setPayments(paymentsData);
      setShares(sharesRes.data);
      setSocios(sociosRes.data);
    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // LÓGICA DE FILTRADO Y ORDENAMIENTO
  const processedPayments = useMemo(() => {
    // 1. Filtrar
    const filtered = payments.filter((p: any) => {
      const search = searchTerm.toLowerCase();
      
      // Acceso a datos anidados (Socio y Entrenador)
      const socioNombre = `${p.socioId?.nombre || ''} ${p.socioId?.apellido || ''}`.toLowerCase();
      const trainerNombre = (p.socioId?.trainerId?.nombre || '').toLowerCase();
      
      return socioNombre.includes(search) || trainerNombre.includes(search);
    });

    // 2. Ordenar por fecha (createdAt o fecha de pago)
    return [...filtered].sort((a: any, b: any) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortAsc ? dateA - dateB : dateB - dateA;
    });
  }, [payments, searchTerm, sortAsc]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7fb", px: { xs: 1.5, sm: 3, md: 4 }, py: { xs: 2, sm: 3 } }}>
      {/* ===== HEADER ===== */}
      <Box sx={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", mb: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 1.5 } }}>
          <Box component="img" src="/logo.png" alt="Logo" sx={{ width: { xs: 44, sm: 56, md: 64 }, height: { xs: 44, sm: 56, md: 64 }, borderRadius: "50%", objectFit: "cover", boxShadow: "0 4px 12px rgba(24,119,242,0.15)" }} />
          <Box sx={{ lineHeight: 1 }}>
            <Typography sx={{ fontWeight: 800, color: "#1877F2", fontSize: { xs: 12, sm: 14, md: 16 }, letterSpacing: 0.2 }}>
              Oxígeno Espacio Deportivo
            </Typography>
          </Box>
        </Box>
        <Tooltip title="Ir al Dashboard">
          <IconButton onClick={() => navigate("/")} sx={{ color: "#1877F2", bgcolor: "rgba(24, 119, 242, 0.05)", border: "1px solid rgba(24, 119, 242, 0.1)", "&:hover": { bgcolor: "rgba(24, 119, 242, 0.12)", transform: "scale(1.05)" }, transition: "all 0.2s" }}>
            <HomeIcon sx={{ fontSize: { xs: 24, sm: 28, md: 32 } }} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* ===== CONTENIDO PRINCIPAL ===== */}
      <Container maxWidth={false} sx={{ maxWidth: 2000, mx: "auto", mt: { xs: 1, sm: 1.5, md: 2 } }}>
        <Box sx={{ bgcolor: "white", borderRadius: 3, boxShadow: "0 10px 30px rgba(17,24,39,0.08)", border: "1px solid rgba(0,0,0,0.06)", overflow: "hidden" }}>
          
          {/* Header de la Card */}
          <Box sx={{ px: { xs: 2, sm: 3 }, py: { xs: 2, sm: 2.5 }, borderBottom: "1px solid rgba(0,0,0,0.06)", background: "linear-gradient(180deg, rgba(24,119,242,0.08), rgba(255,255,255,0))" }}>
            <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ xs: "stretch", md: "center" }} justifyContent="space-between">
              <Box>
                <Typography sx={{ fontWeight: 900, color: "#111827", fontSize: { xs: 26, sm: 32, md: 36 }, lineHeight: 1.05 }}>
                  Gestión de Pagos
                </Typography>
                <Typography sx={{ mt: 0.8, color: "#6b7280", fontSize: { xs: 13, sm: 14 } }}>
                  Controlá el estado de cuenta y filtrá por socio o entrenador.
                </Typography>
              </Box>

              {/* BARRA DE HERRAMIENTAS: BUSCAR + ORDENAR + CREAR */}
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ width: { xs: "100%", md: "auto" } }}>
                <TextField
                  size="small"
                  placeholder="Buscar socio"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  sx={{ width: { xs: "100%", sm: 280 }, "& .MuiOutlinedInput-root": { borderRadius: 2, bgcolor: "white" } }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: "#6b7280" }} />
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  variant="outlined"
                  onClick={() => setSortAsc(!sortAsc)}
                  startIcon={<SortIcon />}
                  sx={{ textTransform: "none", borderRadius: 2, borderColor: "rgba(24, 119, 242, 0.3)", color: "#1877F2", fontWeight: 600 }}
                >
                  {sortAsc ? "Pago Antiguo" : "Pago Reciente"}
                </Button>

                <Button
                  variant="contained"
                  onClick={handleOpen}
                  sx={{ bgcolor: "#1877F2", textTransform: "none", borderRadius: 2, px: 2.5, fontWeight: 700, boxShadow: "0 8px 18px rgba(24,119,242,0.25)", "&:hover": { bgcolor: "#166fe5" } }}
                >
                  Generar pagos
                </Button>
              </Stack>
            </Stack>
          </Box>

          {/* Tabla de Pagos Filtrada y Ordenada */}
          <Box sx={{ overflowX: "auto" }}>
            <PaymentTable
              payments={processedPayments}
              shares={shares}
              onToggle={async (id) => {
                await togglePayment(id);
                loadData();
              }}
              onUpdateShare={async (id, shareId) => {
                await updatePaymentShare(id, shareId);
                loadData();
              }}
            />
          </Box>
        </Box>

        {/* Modal de Generación */}
        <Dialog open={open} onClose={handleClose} fullScreen={fullScreen} maxWidth="md" fullWidth>
          <DialogTitle sx={{ fontWeight: 700 }}>Generar nuevos pagos</DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 1 }}>
              <PaymentGenerateForm
                shares={shares}
                socios={socios}
                onGenerate={async (data) => {
                  await generatePayments(data);
                  handleClose();
                  loadData();
                }}
                onCancel={handleClose}
              />
            </Box>
          </DialogContent>
        </Dialog>
      </Container>
    </Box>
  );
};