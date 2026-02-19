import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Paper,
  TableContainer,
  Chip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import type { Share } from "../../types/share.types";

interface Props {
  shares: Share[];
  onEdit: (s: Share) => void;
  onDelete: (id: string) => void;
}

function formatDate(date: Date | string) {
  const d = new Date(date);
  return d.toLocaleDateString("es-AR");
}

export default function SharesTable({ shares, onEdit, onDelete }: Props) {
  
  // 🔹 ORDENAMIENTO: De más reciente a más antigua
  const sortedShares = [...shares].sort((a, b) => {
    return new Date(b.quoteDate).getTime() - new Date(a.quoteDate).getTime();
  });

  return (
    <TableContainer component={Paper} elevation={2}>
      <Table>
        <TableHead sx={{ bgcolor: "#f5f5f5" }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>Días</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Monto</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Vigente desde</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {sortedShares.map(s => (
            <TableRow key={s._id} hover>
              <TableCell>
                {s.numberDays === 0 ? (
                  <Chip label="Sin límite" size="small" variant="outlined" color="info" />
                ) : (
                  `${s.numberDays} días`
                )}
              </TableCell>
              
              <TableCell>
                {s.amount === 0 ? (
                  <Chip label="Gratis / Beca" size="small" color="success" />
                ) : (
                  `$ ${s.amount}`
                )}
              </TableCell>

              <TableCell>{formatDate(s.quoteDate)}</TableCell>

              <TableCell align="right">
                <IconButton 
                  onClick={() => onEdit(s)} 
                  color="primary"
                  size="small"
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => onDelete(s._id)}
                  size="small"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
          {sortedShares.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} align="center" sx={{ py: 3, color: 'gray' }}>
                No hay cuotas configuradas.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}