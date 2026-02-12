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
} from "@mui/material";
import { useEffect, useState } from "react";
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
  const [open, setOpen] = useState(false);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const loadData = async () => {
    try {
      const [paymentsData, sharesRes, sociosRes] =
        await Promise.all([
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

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f5f7fb",
        px: { xs: 1.5, sm: 3, md: 4 },
        py: { xs: 2, sm: 3 },
      }}
    >
      {/* ===== HEADER (Logo + Marca) ===== */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: { xs: 1, sm: 1.5 },
          mb: { xs: 2, sm: 3 },
        }}
      >
        <Box
          component="img"
          src="/logo.png"
          alt="Logo"
          sx={{
            width: { xs: 44, sm: 56, md: 64 },
            height: { xs: 44, sm: 56, md: 64 },
            borderRadius: "50%",
            objectFit: "cover",
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
          {/* Header de la Card */}
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
                  Gestión de Pagos
                </Typography>
                <Typography
                  sx={{
                    mt: 0.8,
                    color: "#6b7280",
                    fontSize: { xs: 13, sm: 14 },
                  }}
                >
                  Controlá el estado de cuenta y procesá los cobros de membresías.
                </Typography>
              </Box>

              <Button
                variant="contained"
                onClick={handleOpen}
                sx={{
                  bgcolor: "#1877F2",
                  textTransform: "none",
                  borderRadius: 2,
                  px: 2.5,
                  width: { xs: "100%", sm: "auto" },
                  boxShadow: "0 8px 18px rgba(24,119,242,0.25)",
                  "&:hover": { bgcolor: "#166fe5" },
                }}
              >
                Crear pago
              </Button>
            </Stack>
          </Box>

          {/* Tabla de Pagos */}
          <Box sx={{ overflowX: "auto" }}>
            <PaymentTable
              payments={payments}
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

        {/* Modal de Generación de Pagos */}
        <Dialog
          open={open}
          onClose={handleClose}
          fullScreen={fullScreen}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ fontWeight: 700 }}>
            Generar nuevos pagos
          </DialogTitle>
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