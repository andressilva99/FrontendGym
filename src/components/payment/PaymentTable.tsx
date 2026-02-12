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
} from "@mui/material";
import { useState } from "react";
import { Edit } from "@mui/icons-material";
import type { Payment, Share } from "../../types/payment.types";

const MONTHS = [
  "",
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
];

interface Props {
  payments: Payment[];
  shares: Share[];
  onToggle: (id: string) => void;
  onUpdateShare: (id: string, shareId: string) => void;
}

export const PaymentTable = ({
  payments,
  shares,
  onToggle,
  onUpdateShare,
}: Props) => {
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <Paper>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Socio</TableCell>
            <TableCell>Entrenador</TableCell>
            <TableCell>Cuota</TableCell>
            <TableCell>Año</TableCell>
            <TableCell>Mes</TableCell>
            <TableCell>Pagado</TableCell>
            <TableCell>Fecha</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {payments.map((p) => (
            <TableRow key={p._id}>
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
                    value={p.shareId?._id ?? ""}
                    onChange={(e) => {
                      onUpdateShare(p._id, e.target.value);
                      setEditingId(null);
                    }}
                  >
                    {shares.map((s) => (
                      <MenuItem key={s._id} value={s._id}>
                        ${s.amount} - {s.numberDays} días - Actualizada:{" "}
                        {new Date().toLocaleDateString("es-AR")}
                      </MenuItem>
                    ))}
                  </Select>
                ) : (
                  <>
                    ${p.shareId?.amount ?? 0}
                    {!p.isPaid && (
                      <IconButton
                        size="small"
                        onClick={() => setEditingId(p._id)}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    )}
                  </>
                )}
              </TableCell>

              <TableCell>{p.year}</TableCell>
              <TableCell>{MONTHS[p.month]}</TableCell>

              <TableCell>
                <Checkbox
                  checked={p.isPaid}
                  onChange={() => onToggle(p._id)}
                />
              </TableCell>

              <TableCell>
                {p.paymentDate
                  ? new Date(p.paymentDate).toLocaleDateString("es-AR")
                  : ""}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};