import { useEffect, useState, useMemo } from "react";
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
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import Swal from 'sweetalert2'; // Importación de SweetAlert2
import withReactContent from 'sweetalert2-react-content';
import type { User } from "../types/user.types";
import { getUsers } from "../api/users.api";
import UsersTable from "../components/users/UsersTable";
import UserForm from "../components/users/UserForm";

const MySwal = withReactContent(Swal);

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const loadUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user: any) => {
      const nameToSearch = user.username || "";
      return nameToSearch.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [users, searchTerm]);

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

  // Función para manejar el éxito al terminar el formulario (Crear/Editar)
  const handleFormFinish = () => {
    handleClose();
    loadUsers();
    
    MySwal.fire({
      title: editingUser ? '¡Usuario Actualizado!' : '¡Usuario Creado!',
      text: editingUser 
        ? 'Los cambios se guardaron correctamente.' 
        : 'El nuevo usuario ha sido registrado en el sistema.',
      icon: 'success',
      confirmButtonColor: '#1877F2',
      timer: 2000
    });
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
      {/* ===== HEADER ===== */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: { xs: 2, sm: 3 },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 1.5 } }}>
          <Box
            component="img"
            src="/logo.png" 
            alt="Logo"
            sx={{
              width: { xs: 44, sm: 56, md: 64 },
              height: { xs: 44, sm: 56, md: 64 },
              borderRadius: "50%",
              objectFit: "cover",
              boxShadow: "0 4px 12px rgba(24,119,242,0.15)",
            }}
          />
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
          </Box>
        </Box>

        <Tooltip title="Ir al Dashboard">
          <IconButton 
            onClick={() => navigate("/")}
            sx={{ 
              color: "#1877F2", 
              bgcolor: "rgba(24, 119, 242, 0.05)",
              border: "1px solid rgba(24, 119, 242, 0.1)",
              "&:hover": { 
                bgcolor: "rgba(24, 119, 242, 0.12)",
                transform: "scale(1.05)"
              },
              transition: "all 0.2s"
            }}
          >
            <HomeIcon sx={{ fontSize: { xs: 24, sm: 28, md: 32 } }} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* ===== CONTENIDO PRINCIPAL ===== */}
      <Container
        maxWidth={false}
        sx={{
          maxWidth: 2000,
          mx: "auto",
          mt: { xs: 1, sm: 1.5, md: 2 },
        }}
      >
        <Box
          sx={{
            bgcolor: "white",
            borderRadius: 3,
            boxShadow: "0 10px 30px rgba(17,24,39,0.08)",
            border: "1px solid rgba(0,0,0,0.06)",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              px: { xs: 2, sm: 3 },
              py: { xs: 2, sm: 2.5 },
              borderBottom: "1px solid rgba(0,0,0,0.06)",
              background: "linear-gradient(180deg, rgba(24,119,242,0.08), rgba(255,255,255,0))",
            }}
          >
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              alignItems={{ xs: "stretch", md: "center" }}
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
                  Administrá el acceso al sistema mediante el nombre de usuario.
                </Typography>
              </Box>

              <Stack 
                direction={{ xs: "column", sm: "row" }} 
                spacing={2}
                sx={{ width: { xs: "100%", md: "auto" } }}
              >
                <TextField
                  size="small"
                  placeholder="Buscar por usuario..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  sx={{
                    width: { xs: "100%", sm: 250 },
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      bgcolor: "white",
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: "#6b7280" }} />
                      </InputAdornment>
                    ),
                  }}
                />
                
                <Button
                  variant="contained"
                  onClick={handleCreate}
                  sx={{
                    bgcolor: "#1877F2",
                    textTransform: "none",
                    borderRadius: 2,
                    px: 3,
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                    boxShadow: "0 8px 18px rgba(24,119,242,0.25)",
                    "&:hover": { bgcolor: "#166fe5" },
                  }}
                >
                  Crear usuario
                </Button>
              </Stack>
            </Stack>
          </Box>

          <Box sx={{ overflowX: "auto" }}>
            <UsersTable 
              users={filteredUsers} 
              onEdit={handleEdit} 
              onReload={loadUsers} 
            />
          </Box>
        </Box>

        <Dialog
          open={open}
          onClose={handleClose}
          fullScreen={fullScreen}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ fontWeight: 700 }}>
            {editingUser ? "Editar usuario" : "Crear usuario"}
          </DialogTitle>

          <DialogContent>
            <UserForm
              user={editingUser}
              onFinish={handleFormFinish} // Usamos la función con SweetAlert
              onCancel={handleClose}
            />
          </DialogContent>
        </Dialog>
      </Container>
    </Box>
  );
}