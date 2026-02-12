import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  IconButton,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import type { Socio } from "../../../types/socio.types";

interface Props {
  socios: Socio[];
  onEdit: (socio: Socio) => void;
  onDelete: (id: string) => void;
}

const formatDate = (date: string) => {
  const [year, month, day] = date.substring(0, 10).split("-");
  return `${day}/${month}/${year}`;
};

export const SocioTable = ({ socios, onEdit, onDelete }: Props) => {
  return (
    <Paper elevation={3}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Apellido</TableCell>
            <TableCell>Nombre</TableCell>
            <TableCell>Fecha Nac.</TableCell>
            <TableCell>Entrenador</TableCell>
            <TableCell align="right">Acciones</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {socios.map((s) => (
            <TableRow key={s._id}>
              <TableCell>{s.apellido}</TableCell>
              <TableCell>{s.nombre}</TableCell>
              <TableCell>{formatDate(s.fechaNacimiento)}</TableCell>
              <TableCell>
                {typeof s.trainerId === "object"
                  ? s.trainerId.username
                  : s.trainerId}
              </TableCell>
              <TableCell align="right">
                <IconButton onClick={() => onEdit(s)} color="primary">
                  <Edit />
                </IconButton>

                <IconButton
                  onClick={() => onDelete(s._id)}
                  color="error"
                >
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};