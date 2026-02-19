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
import type { Payment, Share, Socio } from "../types/payment.types";
import type { User } from "../types/user.types";
import { PaymentGenerateForm } from "../components/payment/PaymentGenerateForm";
import { PaymentTable } from "../components/payment/PaymentTable";

const mesesValores: { [key: string]: number } = {
  enero: 1, febrero: 2, marzo: 3, abril: 4, mayo: 5, junio: 6,
  julio: 7, agosto: 8, septiembre: 9, octubre: 10, noviembre: 11, diciembre: 12
};

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

      let filteredPayments = paymentsData;
      let filteredSocios = sociosRes.data;

      // 🔥 FILTRO POR ROL
      if (user.role === "ENTRENADOR") {
        filteredSocios = sociosRes.data.filter(
          (s: Socio) =>
            typeof s.trainerId !== "string" &&
            s.trainerId?.username === user.username
        );

        filteredPayments = paymentsData.filter(
          (p: any) =>
            p.socioId?.trainerId?.username === user.username
        );
      }

      setPayments(filteredPayments);
      setShares(sharesRes.data);
      setSocios(filteredSocios);

    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  };

  useEffect(() => { loadData(); }, []);

  const processedPayments = useMemo(() => {
    const filtered = payments.filter((p: any) => {
      const search = searchTerm.toLowerCase();
      const socioNombre = `${p.socioId?.nombre || ''} ${p.socioId?.apellido || ''}`.toLowerCase();
      const trainerNombre = (p.socioId?.trainerId?.username || '').toLowerCase();
      return socioNombre.includes(search) || trainerNombre.includes(search);
    });

    return [...filtered].sort((a: any, b: any) => {
      const anioA = parseInt(a.year || 0);
      const anioB = parseInt(b.year || 0);

      const mesA = typeof a.month === 'number' ? a.month : (mesesValores[a.mes?.toLowerCase()] || 0);
      const mesB = typeof b.month === 'number' ? b.month : (mesesValores[b.mes?.toLowerCase()] || 0);

      const totalA = (anioA * 12) + mesA;
      const totalB = (anioB * 12) + mesB;

      return sortAsc ? totalA - totalB : totalB - totalA;
    });
  }, [payments, searchTerm, sortAsc]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box>
      {/* 🔥 NO SE TOCA NADA VISUAL ABAJO */}

      <PaymentTable
        payments={processedPayments}
        shares={shares}
        onToggle={async (id) => { await togglePayment(id); loadData(); }}
        onUpdateShare={async (id, shareId) => { await updatePaymentShare(id, shareId); loadData(); }}
      />

      <Dialog open={open} onClose={handleClose} fullScreen={fullScreen} maxWidth="md" fullWidth>
        <DialogTitle>Generar nuevos pagos</DialogTitle>
        <DialogContent>
          <PaymentGenerateForm
            shares={shares}
            socios={socios} // 🔥 YA FILTRADOS SEGÚN ROL
            onGenerate={async (data) => {
              await generatePayments(data);
              handleClose();
              loadData();
            }}
            onCancel={handleClose}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};