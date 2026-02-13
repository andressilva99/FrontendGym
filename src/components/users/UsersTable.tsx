import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Paper,
  TableContainer,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import type { User } from "../../types/user.types";
import { deleteUser } from "../../api/users.api";

// Importación de SweetAlert2
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

interface Props {
  users: User[];
  onEdit: (u: User) => void;
  onReload: () => void;
}

export default function UsersTable({ users, onEdit, onReload }: Props) {
  
  const handleDelete = async (id: string) => {
    // Reemplazamos el confirm nativo por el diseño de SweetAlert2
    MySwal.fire({
      title: '¿Eliminar usuario?',
      text: "Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1877F2', // Azul que usas en el logo
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteUser(id);
          onReload(); // Esto recarga la lista en tu UsersPage
          
          MySwal.fire({
            title: '¡Eliminado!',
            text: 'El usuario ha sido borrado correctamente.',
            icon: 'success',
            confirmButtonColor: '#1877F2',
            timer: 1500,
            showConfirmButton: false
          });
        } catch (error) {
          MySwal.fire({
            title: 'Error',
            text: 'No se pudo eliminar al usuario.',
            icon: 'error',
            confirmButtonColor: '#1877F2'
          });
        }
      }
    });
  };

  return (
    <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
      <Table>
        <TableHead sx={{ bgcolor: '#f8f9fa' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>Usuario</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>DNI</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Rol</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {users.map((u) => (
            <TableRow key={u._id} hover>
              <TableCell>{u.username}</TableCell>
              <TableCell>{u.dni || "N/A"}</TableCell>
              <TableCell>
                <Box 
                  sx={{ 
                    display: 'inline-block',
                    px: 1.5, py: 0.5, borderRadius: 1, fontSize: '0.75rem',
                    bgcolor: (u.role as any) === 'admin' ? '#E3F2FD' : '#F5F5F5',
                    color: (u.role as any) === 'admin' ? '#1976D2' : '#616161',
                    fontWeight: 'bold',
                    textTransform: 'uppercase'
                  }}
                >
                  {u.role}
                </Box>
              </TableCell>
              <TableCell align="right">
                <IconButton onClick={() => onEdit(u)} color="primary">
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton color="error" onClick={() => handleDelete(u._id!)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}