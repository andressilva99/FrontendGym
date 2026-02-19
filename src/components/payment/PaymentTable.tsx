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

// Función auxiliar para formatear la fecha de pago
const formatDate = (date: any) => {
  if (!date) return "—";
  const d = new Date(date);
  return d.toLocaleDateString("es-AR", {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
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

  // Ordenar cuotas disponibles por fecha de vigencia
  const sortedShares = useMemo(() => {
    return [...shares].sort((a, b) => 
      new Date(b.quoteDate).getTime() - new Date(a.quoteDate).getTime()
    );
  }, [shares]);

  return (
    <Paper elevation={0} sx={{ border: "1px solid rgba(0,0,0,0.05)" }}>
      <Table>
        <TableHead sx={{ bgcolor: "#f8f9fa" }}>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>Socio</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Entrenador</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Cuota / Monto</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Año</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Mes</TableCell>
            <TableCell sx={{ fontWeight: "bold" }} align="center">Pagado</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Fecha Pago</TableCell>
            <TableCell sx={{ fontWeight: "bold" }} align="center">Acciones</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {payments.map((p) => (
            <TableRow 
              key={p._id} 
              hover 
              sx={{ bgcolor: p.isPaid ? "rgba(76, 175, 80, 0.02)" : "inherit" }}
            >
              <TableCell sx={{ fontWeight: 600 }}>
                {p.socioId ? `${p.socioId.apellido}, ${p.socioId.nombre}` : "Sin socio"}
              </TableCell>

              <TableCell>{p.socioId?.trainerId?.username ?? "-"}</TableCell>

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
                    <Typography variant="body2" sx={{ fontWeight: 700, color: "#1e293b" }}>
                      ${p.shareId?.amount ?? 0}
                    </Typography>
                    {!p.isPaid && (
                      <IconButton size="small" onClick={() => setEditingId(p._id)} sx={{ color: '#1877F2' }}>
                        <Edit fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                )}
              </TableCell>

              <TableCell>{p.year}</TableCell>
              <TableCell>{MONTHS[p.month]}</TableCell>

              <TableCell align="center">
                <Tooltip title={p.isPaid ? "Marcar como pendiente" : "Marcar como pagado"}>
                  <Checkbox
                    checked={p.isPaid}
                    onChange={() => onToggle(p._id)}
                    color="primary"
                    sx={{ '& .MuiSvgIcon-root': { fontSize: 26 } }}
                  />
                </Tooltip>
              </TableCell>

              <TableCell>
                {p.isPaid ? (
                  <Typography variant="body2" sx={{ color: "#2e7d32", fontWeight: 600 }}>
                    {formatDate(p.paymentDate)}
                  </Typography>
                ) : (
                  <Typography variant="body2" color="textDisabled">Pendiente</Typography>
                )}
              </TableCell>

              <TableCell align="center">
                <IconButton color="error" onClick={() => onDelete(p._id)}>
                  <Delete fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};