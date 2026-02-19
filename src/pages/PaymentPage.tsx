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
  Tabs,
  Tab,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import Swal from 'sweetalert2';

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
  GeneratePaymentDto 
} from "../types/payment.types";
import type { User } from "../types/user.types";
import { PaymentGenerateForm } from "../components/payment/PaymentGenerateForm";
import { PaymentTable } from "../components/payment/PaymentTable";

interface Props {
  user: User;
}

export const PaymentsPage = ({ user }: Props) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [shares, setShares] = useState<Share[]>([]);
  const [socios, setSocios] = useState<Socio[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortAsc, setSortAsc] = useState(false); 
  const [open, setOpen] = useState(false);
  
  // 🔹 Filtro de estado: "all" | "paid" | "unpaid"
  const [statusFilter, setStatusFilter] = useState("all");

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

      let filteredPayments: Payment[] = paymentsData;
      let filteredSocios: Socio[] = sociosRes.data;

      if (user.role === "ENTRENADOR") {
        filteredSocios = sociosRes.data.filter(
          (s: Socio) => s.trainerId?.username === user.username
        );
        filteredPayments = paymentsData.filter(
          (p: Payment) => p.socioId?.trainerId?.username === user.username
        );
      }

      setPayments(filteredPayments);
      setShares(sharesRes.data);
      setSocios(filteredSocios);
    } catch (error) {
      console.error("Error cargando datos:", error);
      Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "El registro de este pago se eliminará permanentemente.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/payments/${id}`);
        Swal.fire({
          title: 'Eliminado',
          text: 'El pago ha sido borrado con éxito.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
        loadData();
      } catch (error) {
        Swal.fire('Error', 'No se pudo eliminar el registro', 'error');
      }
    }
  };

  // 🔹 Lógica combinada: Búsqueda + Filtro de Estado + Orden
  const processedPayments = useMemo(() => {
    const filtered = payments.filter((p) => {
      // 1. Búsqueda por texto
      const search = searchTerm.toLowerCase();
      const socioFull = `${p.socioId?.nombre || ''} ${p.socioId?.apellido || ''}`.toLowerCase();
      const trainerUser = (p.socioId?.trainerId?.username || '').toLowerCase();
      const matchesSearch = socioFull.includes(search) || trainerUser.includes(search);

      // 2. Filtro por estado del pago
      const matchesStatus = 
        statusFilter === "all" ? true :
        statusFilter === "paid" ? p.isPaid === true :
        p.isPaid === false;

      return matchesSearch && matchesStatus;
    });

    // 3. Ordenamiento por año/mes
    return [...filtered].sort((a, b) => {
      const totalA = (a.year * 12) + a.month;
      const totalB = (b.year * 12) + b.month;
      return sortAsc ? totalA - totalB : totalB - totalA;
    });
  }, [payments, searchTerm, sortAsc, statusFilter]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7fb", px: { xs: 1, sm: 3, md: 4 }, py: { xs: 2, sm: 3 } }}>
      
      {/* HEADER */}
      <Box sx={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", mb: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 1.5 } }}>
          <Box component="img" src="/logo.png" sx={{ width: { xs: 45, sm: 56 }, height: { xs: 45, sm: 56 }, borderRadius: "50%" }} />
          <Typography sx={{ fontWeight: 800, color: "#1877F2", fontSize: { xs: 12, sm: 16 } }}>
            Oxígeno Espacio Deportivo
          </Typography>
        </Box>
        <Tooltip title="Volver al Inicio">
          <IconButton onClick={() => navigate("/")} sx={{ color: "#1877F2", bgcolor: "rgba(24, 119, 242, 0.1)" }}>
            <HomeIcon sx={{ fontSize: { xs: 28, sm: 32 } }} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* CONTENIDO PRINCIPAL */}
      <Container maxWidth={false} sx={{ maxWidth: 2000, p: { xs: 0, sm: 2 } }}>
        <Box sx={{ bgcolor: "white", borderRadius: { xs: 2, sm: 3 }, boxShadow: "0 10px 30px rgba(0,0,0,0.05)", overflow: "hidden" }}>
          
          <Box sx={{ px: { xs: 2, sm: 3 }, py: 2.5, borderBottom: "1px solid rgba(0,0,0,0.06)", background: "linear-gradient(180deg, rgba(24,119,242,0.05), #fff)" }}>
            <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="center" justifyContent="space-between" mb={2}>
              <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
                <Typography variant="h4" sx={{ fontWeight: 900 }}>Gestión de Pagos</Typography>
                <Typography variant="body2" color="textSecondary">
                  {user.role === "ENTRENADOR" ? `Vista restringida: ${user.username}` : "Panel de Administración Full"}
                </Typography>
              </Box>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ width: { xs: "100%", sm: "auto" } }}>
                <TextField
                  size="small"
                  placeholder="Buscar socio o entrenador..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{ startAdornment: <SearchIcon sx={{ color: 'gray', mr: 1, fontSize: 20 }} /> }}
                  sx={{ minWidth: { sm: 250 } }}
                />
                <Button variant="outlined" onClick={() => setSortAsc(!sortAsc)} startIcon={<SortIcon />} sx={{textTransform: 'none', px: 3 }}>
                  {sortAsc ? "Más Antiguos" : "Más Recientes"}
                </Button>
                <Button variant="contained" onClick={handleOpen} sx={{ bgcolor: "#1877F2", textTransform: 'none', px: 3 }}>
                  Generar pagos
                </Button>
              </Stack>
            </Stack>

            {/* BARRA DE FILTRADO POR ESTADO */}
            <Divider sx={{ mb: 1 }} />
            <Tabs 
              value={statusFilter} 
              onChange={(_, val) => setStatusFilter(val)}
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab label="Todos" value="all" sx={{ textTransform: 'none', fontWeight: 700 }} />
              <Tab label="Pagados" value="paid" sx={{ textTransform: 'none', fontWeight: 700 }} />
              <Tab label="Pendientes" value="unpaid" sx={{ textTransform: 'none', fontWeight: 700 }} />
            </Tabs>
          </Box>

          <Box sx={{ width: "100%", overflowX: "auto" }}>
            <PaymentTable
              payments={processedPayments}
              shares={shares}
              onToggle={async (id) => { await togglePayment(id); loadData(); }}
              onUpdateShare={async (id, shareId) => { await updatePaymentShare(id, shareId); loadData(); }}
              onDelete={handleDelete}
            />
          </Box>
        </Box>

        {/* MODAL DE GENERACIÓN */}
        <Dialog open={open} onClose={handleClose} fullScreen={fullScreen} maxWidth="md" fullWidth>
          <DialogTitle sx={{ fontWeight: 700 }}>Generar Cuotas Mensuales</DialogTitle>
          <DialogContent sx={{ pb: 3 }}>
            <PaymentGenerateForm
              shares={shares}
              socios={socios}
              onGenerate={async (data: GeneratePaymentDto) => {
                const duplicados = data.socioIds.map(id => {
                  const s = socios.find(soc => soc._id === id);
                  const existe = payments.find(p => {
                    const pSocioId = typeof p.socioId === 'object' ? p.socioId?._id : p.socioId;
                    return pSocioId === id && p.year === data.year && p.month === data.month;
                  });
                  return existe ? `${s?.nombre} ${s?.apellido}` : null;
                }).filter(n => n !== null);

                if (duplicados.length > 0) {
                  handleClose(); 
                  Swal.fire({
                    title: 'Acción Bloqueada',
                    html: `<div style="text-align: left;">Ya existen cuotas para:<br><b style="color:#d32f2f">${duplicados.join(', ')}</b><br>en el periodo seleccionado.</div>`,
                    icon: 'error',
                    confirmButtonColor: '#1877F2',
                  });
                  return; 
                }

                try {
                  Swal.fire({ title: 'Generando...', didOpen: () => Swal.showLoading() });
                  await generatePayments(data);
                  handleClose();
                  await Swal.fire({ icon: 'success', title: 'Pagos generados', timer: 1500, showConfirmButton: false });
                  loadData(); 
                } catch (error) {
                  Swal.fire('Error', 'No se pudieron generar los pagos', 'error');
                }
              }}
              onCancel={handleClose}
            />
          </DialogContent>
        </Dialog>
      </Container>
    </Box>
  );
};