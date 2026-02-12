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
  Stack,
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
        bgcolor: "#f5f7fb",
        px: { xs: 1.5, sm: 3, md: 4 },
        py: { xs: 2, sm: 3 },
      }}
    >
      {/* ===== HEADER (logo + texto) ===== */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: { xs: 1, sm: 1.5 },
          mb: { xs: 2, sm: 3 },
        }}
      >
        {/* Logo */}
        <Box
          component="img"
          src="/logo.png" 
          alt="Logo"
          sx={{
            width: { xs: 44, sm: 56, md: 64 },
            height: { xs: 44, sm: 56, md: 64 },
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />

        {/* Texto */}
        <Box sx={{ lineHeight: 1 }}>
          <Typography
            sx={{
              fontWeight: 800,
              color: "#1877F2",
              fontSize: { xs: 12, sm: 14, md: 16 },
              letterSpacing: 0.2,
            }}
          >
            Oxígeno Espacio Deportivo
          </Typography>
          <Typography
            sx={{
              color: "#6b7280",
              fontSize: { xs: 11, sm: 12 },
              mt: 0.2,
            }}
          >
            
          </Typography>
        </Box>
      </Box>

      {/* ===== CONTENIDO CENTRADO ===== */}
      <Container
        maxWidth={false}
        sx={{
          maxWidth: 2000,
          mx: "auto",
          mt: { xs: 1, sm: 1.5, md: 2 }, // ✅ baja un poco todo
        }}
      >
        {/* Card / Encabezado de la sección */}
        <Box
          sx={{
            bgcolor: "white",
            borderRadius: 3,
            boxShadow: "0 10px 30px rgba(17,24,39,0.08)",
            border: "1px solid rgba(0,0,0,0.06)",
            overflow: "hidden",
          }}
        >
          {/* Header de la card */}
          <Box
            sx={{
              px: { xs: 2, sm: 3 },
              py: { xs: 2, sm: 2.5 },
              borderBottom: "1px solid rgba(0,0,0,0.06)",
              background:
                "linear-gradient(180deg, rgba(24,119,242,0.08), rgba(255,255,255,0))",
            }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              alignItems={{ xs: "stretch", sm: "center" }}
              justifyContent="space-between"
            >
              <Box>
                <Typography
                  sx={{
                    fontWeight: 900,
                    color: "#111827",
                    fontSize: { xs: 26, sm: 32, md: 36 },
                    lineHeight: 1.05,
                  }}
                >
                  Gestión de Usuarios
                </Typography>

                <Typography
                  sx={{
                    mt: 0.8,
                    color: "#6b7280",
                    fontSize: { xs: 13, sm: 14 },
                  }}
                >
                  Administrá usuarios, DNI y roles en un solo lugar.
                </Typography>
              </Box>

              <Button
                variant="contained"
                onClick={handleCreate}
                sx={{
                  bgcolor: "#1877F2",
                  textTransform: "none",
                  borderRadius: 2,
                  px: 2.5,
                  width: { xs: "100%", sm: "auto" },
                  boxShadow: "0 8px 18px rgba(24,119,242,0.25)",
                  "&:hover": { bgcolor: "#166fe5" },
                }}
              >
                Crear usuario
              </Button>
            </Stack>
          </Box>

          {/* Tabla (scroll horizontal en móvil) */}
          <Box sx={{ overflowX: "auto" }}>
            <UsersTable users={users} onEdit={handleEdit} onReload={loadUsers} />
          </Box>
        </Box>

        {/* Modal */}
        <Dialog
          open={open}
          onClose={handleClose}
          fullScreen={fullScreen}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>{editingUser ? "Editar usuario" : "Crear usuario"}</DialogTitle>

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
    </Box>
  );
}
