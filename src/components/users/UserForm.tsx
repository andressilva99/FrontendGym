import {
  Box,
  Button,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import type { User } from "../../types/user.types";
import { createUser, updateUser } from "../../api/users.api";

interface Props {
  user: User | null;
  onFinish: () => void;
  onCancel: () => void;
}

export default function UserForm({ user, onFinish, onCancel }: Props) {
  const [form, setForm] = useState({
    username: "",
    dni: "",
    role: "",
    password: "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        username: user.username,
        dni: String(user.dni),
        role: user.role,
        password: "",
      });
    } else {
      setForm({
        username: "",
        dni: "",
        role: "",
        password: "",
      });
    }
  }, [user]);

  const submit = async () => {
    const payload: any = {
      username: form.username.trim(),
      dni: Number(form.dni),
      role: form.role,
    };

    if (form.password) payload.password = form.password;

    if (user) {
      await updateUser(user._id, payload);
    } else {
      await createUser({ ...payload, password: form.password });
    }

    onFinish();
  };

  return (
    <Paper elevation={0}>
      <Typography variant="h6" mb={2}>
        {user ? "Editar usuario" : "Crear usuario"}
      </Typography>

      <Box display="grid" gap={2}>
        <TextField
          label="Usuario"
          value={form.username}
          onChange={e => setForm({ ...form, username: e.target.value })}
          fullWidth
        />

        <TextField
          label="DNI"
          type="number"
          value={form.dni}
          onChange={e => setForm({ ...form, dni: e.target.value })}
          fullWidth
        />

        <TextField
          select
          label="Rol"
          value={form.role}
          onChange={e => setForm({ ...form, role: e.target.value })}
          fullWidth
        >
          <MenuItem value="ADMINISTRATIVO">Administrativo</MenuItem>
          <MenuItem value="ENTRENADOR">Entrenador</MenuItem>
        </TextField>

        <TextField
          label="Password"
          type="password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          helperText={user ? "Opcional (solo si desea cambiarla)" : "Obligatoria"}
          fullWidth
        />

        <Box
          display="flex"
          gap={2}
          justifyContent="flex-end"
          mt={1}
          flexWrap="wrap"
        >
          <Button variant="outlined" onClick={onCancel}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={submit}>
            {user ? "Actualizar" : "Crear"}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}