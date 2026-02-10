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
import type { User } from "../../types/user.types";
import { deleteUser } from "../../api/users.api";

interface Props {
  users: User[];
  onEdit: (u: User) => void;
  onReload: () => void;
}

export default function UsersTable({ users, onEdit, onReload }: Props) {
  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar usuario?")) return;
    await deleteUser(id);
    onReload();
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Usuario</TableCell>
            <TableCell>DNI</TableCell>
            <TableCell>Rol</TableCell>
            <TableCell align="right">Acciones</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {users.map(u => (
            <TableRow key={u._id}>
              <TableCell>{u.username}</TableCell>
              <TableCell>{u.dni}</TableCell>
              <TableCell>{u.role}</TableCell>
              <TableCell align="right">
                <IconButton onClick={() => onEdit(u)}>
                  <EditIcon />
                </IconButton>
                <IconButton color="error" onClick={() => handleDelete(u._id)}>
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