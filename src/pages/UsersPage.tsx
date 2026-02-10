import {
  Box,
  Button,
  Container,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import type { User } from "../types/user.types";
import { getUsers } from "../api/users.api";
import UsersTable from "../components/users/UsersTable";
import UserForm from "../components/users/UserForm";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const loadUsers = async () => {
    const data = await getUsers();
    setUsers(data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" mb={3}>
        Gestión de Usuarios
      </Typography>

      <UsersTable
        users={users}
        onEdit={setEditingUser}
        onReload={loadUsers}
      />

      <Box mt={4}>
        <UserForm
          user={editingUser}
          onFinish={() => {
            setEditingUser(null);
            loadUsers();
          }}
        />
      </Box>
    </Container>
  );
}