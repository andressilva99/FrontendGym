import {
  Box,
  Button,
  Container,
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
  Paper,
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
        pt: { xs: 6, md: 9 }, 
        pb: 6,
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          width: "100%",
          maxWidth: { xs: "100%", md: "1400px", lg: "2000px" }, // más ancho en desktop
          px: { xs: 2, md: 4, lg: 6 }, // padding lateral responsive
        }}
      >
        <Paper
          elevation={3}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              px: { xs: 3, md: 5 },
              py: { xs: 3, md: 4 },
              borderBottom: "1px solid #e0e0e0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: "#1c1e21",
                }}
              >
                Gestión de Usuarios
              </Typography>

              <Typography variant="body2" sx={{ color: "#65676b", mt: 1 }}>
                Administrá usuarios, DNI y roles en un solo lugar.
              </Typography>
            </Box>

            <Button
              variant="contained"
              onClick={handleCreate}
              sx={{
                backgroundColor: "#1877f2",
                textTransform: "none",
                fontWeight: 600,
                px: 3,
                "&:hover": { backgroundColor: "#166fe5" },
              }}
            >
              Crear usuario
            </Button>
          </Box>

          {/* Tabla */}
          <Box sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
            <UsersTable users={users} onEdit={handleEdit} onReload={loadUsers} />
          </Box>
        </Paper>
      </Container>

      {/* Dialog */}
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
