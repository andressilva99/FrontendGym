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
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f0f2f5",
        pt: 8, // baja el contenido un toque (espacio arriba)
        pb: 8,
        px: 2,
        position: "relative",
      }}
    >
      {/* LOGO ARRIBA IZQUIERDA */}
      <Box
        sx={{
          position: "absolute",
          top: 15,
          left: 24,
          display: "flex",
          alignItems: "center",
          gap: 1,
          zIndex: 10,
        }}
      >
        <img
          src="/logo.png"
          alt="Logo Gym"
          style={{ height: 70, width: "auto", display: "block" }}
        />
        <Typography
          variant="h6"
          sx={{
            fontWeight: 800,
            mt: -1,
            fontSize: "8px",
            color: "#1877f2",
            letterSpacing: 0.2,
          }}
        >
          Oxigeno Espacio Deportivo
        </Typography>
      </Box>

      {/* CONTENEDOR CENTRAL */}
      <Container maxWidth={false} sx={{ maxWidth: "2000px !important" }}>
        <Box
          sx={{
            backgroundColor: "#fff",
            borderRadius: 3,
            boxShadow: "0 6px 24px rgba(0,0,0,0.10)",
            overflow: "hidden",
          }}
        >
          {/* HEADER DE LA CARD */}
          <Box
            sx={{
              px: { xs: 2, sm: 3, md: 4 },
              py: { xs: 2, sm: 2.5, md: 3 },
              borderBottom: "1px solid #e5e7eb",
              background:
                "linear-gradient(180deg, rgba(24,119,242,0.10) 0%, rgba(255,255,255,1) 70%)",
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              flexWrap="wrap"
              gap={2}
            >
              <Box>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 800, color: "#111827" }}
                >
                  Gestión de Usuarios
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#6b7280", mt: 0.5 }}
                >
                  Administrá usuarios, DNI y roles en un solo lugar.
                </Typography>
              </Box>

              <Button
                variant="contained"
                onClick={handleCreate}
                sx={{
                  backgroundColor: "#1877f2",
                  "&:hover": { backgroundColor: "#145ecf" },
                  textTransform: "none",
                  fontWeight: 700,
                  borderRadius: 2,
                  px: 2.5,
                  py: 1.1,
                }}
              >
                Crear usuario
              </Button>
            </Box>
          </Box>

          {/* TABLA */}
          <Box sx={{ px: { xs: 1, sm: 2, md: 3 }, py: { xs: 2, md: 3 } }}>
            <UsersTable users={users} onEdit={handleEdit} onReload={loadUsers} />
          </Box>
        </Box>
      </Container>

      {/* MODAL CREAR/EDITAR */}
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
    </Box>
  );
}
