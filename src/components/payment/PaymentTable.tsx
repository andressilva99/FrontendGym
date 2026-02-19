import {
  IconButton,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Checkbox,
  Paper,
  Typography,
  Box,
  Tooltip,
} from "@mui/material";
import { useState, useMemo } from "react";
import { Edit, Delete } from "@mui/icons-material";
import type { Payment, Share } from "../../types/payment.types";

const MONTHS = [
  "",
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const formatDate = (date: any) => {
  if (!date) return "N/A";
  const d = new Date(date);
  return d.toLocaleDateString("es-AR");
};

interface Props {
  payments: Payment[];
  shares: Share[];
  onToggle: (id: string) => void;
  onUpdateShare: (id: string, shareId: string) => void;
  onDelete: (id: string) => void;
}

export const PaymentTable = ({
  payments,
  shares,
  onToggle,
  onUpdateShare,
  onDelete,
}: Props) => {
  const [editingId, setEditingId] = useState<string | null>(null);

  // 🔹 Ordenar Cuotas: Más reciente a más antigua para el selector de edición
  const sortedShares = useMemo(() => {
    return [...shares].sort((a, b) => 
      new Date(b.quoteDate).getTime() - new Date(a.quoteDate).getTime()
    );
  }, [shares]);

  return (
    <Paper elevation={0}>
      <Table>
        <TableHead sx={{ bgcolor: "#f8f9fa" }}>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>Socio</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Entrenador</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Cuota / Monto</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Año</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Mes</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Pagado</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Fecha Pago</TableCell>
            <TableCell sx={{ fontWeight: "bold" }} align="center">Acciones</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {payments.map((p) => (
            <TableRow key={p._id} hover>
              <TableCell>
                {p.socioId
                  ? `${p.socioId.apellido}, ${p.socioId.nombre}`
                  : "Sin socio"}
              </TableCell>

              <TableCell>
                {p.socioId?.trainerId?.username ?? "-"}
              </TableCell>

              <TableCell>
                {editingId === p._id && !p.isPaid ? (
                  <Select
                    size="small"
                    defaultOpen
                    value={p.shareId?._id ?? ""}
                    onChange={(e) => {
                      onUpdateShare(p._id, e.target.value);
                      setEditingId(null);
                    }}
                    onClose={() => setEditingId(null)}
                    sx={{ minWidth: 180 }}
                  >
                    {/* 🔹 Usamos sortedShares en lugar de shares */}
                    {sortedShares.map((s) => (
                      <MenuItem key={s._id} value={s._id}>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            ${s.amount} - {s.numberDays} días
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            Vigencia: {formatDate(s.quoteDate)}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                ) : (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      ${p.shareId?.amount ?? 0}
                    </Typography>
                    {!p.isPaid && (
                      <Tooltip title="Cambiar cuota">
                        <IconButton
                          size="small"
                          onClick={() => setEditingId(p._id)}
                          sx={{ color: '#1877F2', p: 0.5 }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                )}
              </TableCell>

              <TableCell>{p.year}</TableCell>
              <TableCell>{MONTHS[p.month]}</TableCell>

              <TableCell>
                <Checkbox
                  checked={p.isPaid}
                  onChange={() => onToggle(p._id)}
                  color="primary"
                />
              </TableCell>

              <TableCell>
                {p.paymentDate ? formatDate(p.paymentDate) : "—"}
              </TableCell>

              <TableCell align="center">
                <Tooltip title="Eliminar registro">
                  <IconButton 
                    size="small" 
                    color="error" 
                    onClick={() => onDelete(p._id)}
                    sx={{ "&:hover": { bgcolor: "rgba(211, 47, 47, 0.04)" } }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};