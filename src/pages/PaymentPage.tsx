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
    <Container maxWidth="lg">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
        flexWrap="wrap"
        gap={2}
      >
        <Typography variant="h4">
          Gestión de Pagos
        </Typography>

        <Button variant="contained" onClick={handleOpen}>
          Crear pago
        </Button>
      </Box>

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

      <Dialog
        open={open}
        onClose={handleClose}
        fullScreen={fullScreen}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Generar pagos
        </DialogTitle>

        <DialogContent>
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
        </DialogContent>
      </Dialog>
    </Container>
  );
};