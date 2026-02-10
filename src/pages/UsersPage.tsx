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
} from "@mui/material";
import { useEffect, useState } from "react";
import type { User } from "../types/user.types";
import { getUsers } from "../api/users.api";
import UsersTable from "../components/users/UsersTable";
import UserForm from "../components/users/UserForm";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const loadUsers = async () => {
    const data = await getUsers();
    setUsers(data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreate = () => {
    setEditingUser(null);
    setOpen(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingUser(null);
  };

  return (
    <Container maxWidth="lg">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
        flexWrap="wrap"
        gap={2}
      >
        <Typography variant="h4">
          Gestión de Usuarios
        </Typography>

        <Button variant="contained" onClick={handleCreate}>
          Crear usuario
        </Button>
      </Box>

      <UsersTable
        users={users}
        onEdit={handleEdit}
        onReload={loadUsers}
      />

      <Dialog
        open={open}
        onClose={handleClose}
        fullScreen={fullScreen}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingUser ? "Editar usuario" : "Crear usuario"}
        </DialogTitle>

        <DialogContent>
          <UserForm
            user={editingUser}
            onFinish={() => {
              handleClose();
              loadUsers();
            }}
            onCancel={handleClose}
          />
        </DialogContent>
      </Dialog>
    </Container>
  );
}