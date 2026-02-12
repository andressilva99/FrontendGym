import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Paper,
  TableContainer,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import type { Share } from "../../types/share.types";

interface Props {
  shares: Share[];
  onEdit: (s: Share) => void;
  onDelete: (id: string) => void;
}

function formatDate(date: string) {
  const d = new Date(date);
  return d.toLocaleDateString();
}

export default function SharesTable({ shares, onEdit, onDelete }: Props) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Días</TableCell>
            <TableCell>Monto</TableCell>
            <TableCell>Vigente desde</TableCell>
            <TableCell align="right">Acciones</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {shares.map(s => (
            <TableRow key={s._id}>
              <TableCell>{s.numberDays}</TableCell>
              <TableCell>$ {s.amount}</TableCell>
              <TableCell>{formatDate(s.quoteDate)}</TableCell>
              <TableCell align="right">
                <IconButton onClick={() => onEdit(s)}>
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => onDelete(s._id)}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}