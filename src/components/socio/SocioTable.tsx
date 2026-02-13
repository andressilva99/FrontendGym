import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  IconButton,
  TableContainer,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

// RUTA CORREGIDA: Según tus capturas, este es el nivel correcto
import type { Socio } from "../../types/socio.types";

interface Props {
  socios: Socio[];
  onEdit: (socio: Socio) => void;
  onDelete: (id: string) => void;
}

export const SocioTable = ({ socios, onEdit, onDelete }: Props) => {
  return (
    <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
      <Table>
        <TableHead sx={{ bgcolor: "#f5f5f5" }}>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>Apellido</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Nombre</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Fecha Nac.</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Entrenador</TableCell>
            <TableCell align="right" sx={{ fontWeight: "bold" }}>
              Acciones
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {socios.map((s) => (
            <TableRow key={s._id} hover>
              <TableCell>{s.apellido}</TableCell>
              <TableCell>{s.nombre}</TableCell>
              <TableCell>
                {s.fechaNacimiento
                  ? new Date(s.fechaNacimiento).toLocaleDateString()
                  : "N/A"}
              </TableCell>
              <TableCell>
                {typeof s.trainerId === "object" && s.trainerId !== null
                  ? (s.trainerId as any).username
                  : "Sin asignar"}
              </TableCell>
              <TableCell align="right">
                <IconButton onClick={() => onEdit(s)} color="primary">
                  <Edit fontSize="small" />
                </IconButton>
                <IconButton onClick={() => onDelete(s._id)} color="error">
                  <Delete fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};