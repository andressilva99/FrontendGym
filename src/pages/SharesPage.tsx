import {
  Box,
  Button,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  useMediaQuery,
  useTheme,
  Stack,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';
import Swal from 'sweetalert2'; // Importación de SweetAlert2
import withReactContent from 'sweetalert2-react-content';
import type { Share } from "../types/share.types";
import { getShares, deleteShare } from "../api/shares.api";
import SharesTable from "../components/shares/SharesTable";
import ShareForm from "../components/shares/SharesForm";

const MySwal = withReactContent(Swal);

export default function SharesPage() {
  const [shares, setShares] = useState<Share[]>([]);
  const [editingShare, setEditingShare] = useState<Share | null>(null);
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const loadShares = async () => {
    const data = await getShares();
    setShares(data);
  };

  useEffect(() => {
    loadShares();
  }, []);

  const handleCreate = () => {
    setEditingShare(null);
    setOpen(true);
  };

  const handleEdit = (share: Share) => {
    setEditingShare(share);
    setOpen(true);
  };

  // FUNCIÓN ACTUALIZADA CON SWEET ALERT
  const handleDelete = async (id: string) => {
    MySwal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción no se puede deshacer y eliminará la cuota permanentemente.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1877F2',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      background: '#ffffff',
      customClass: {
        popup: 'rounded-lg'
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteShare(id);
          loadShares();
          
          // Alerta de éxito
          MySwal.fire({
            title: '¡Eliminado!',
            text: 'La cuota ha sido eliminada correctamente.',
            icon: 'success',
            confirmButtonColor: '#1877F2',
            timer: 2000
          });
        } catch (error) {
          MySwal.fire({
            title: 'Error',
            text: 'No se pudo eliminar la cuota.',
            icon: 'error',
            confirmButtonColor: '#1877F2',
          });
        }
      }
    });
  };

  const handleClose = () => {
    setOpen(false);
    setEditingShare(null);
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

      {/* ===== CONTENIDO ===== */}
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
                  Gestión de Cuotas
                </Typography>
                <Typography
                  sx={{
                    mt: 0.8,
                    color: "#6b7280",
                    fontSize: { xs: 13, sm: 14 },
                  }}
                >
                  Registrá y controlá los tipos de cuotas y membresías del gimnasio.
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
                  fontWeight: 700,
                  width: { xs: "100%", sm: "auto" },
                  boxShadow: "0 8px 18px rgba(24,119,242,0.25)",
                  "&:hover": { bgcolor: "#166fe5" },
                }}
              >
                Nueva Cuota
              </Button>
            </Stack>
          </Box>

          <Box sx={{ overflowX: "auto" }}>
            <SharesTable
              shares={shares}
              onEdit={handleEdit}
              onDelete={handleDelete}
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
            {editingShare ? "Editar Cuota" : "Crear Cuota"}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 1 }}>
              <ShareForm
                share={editingShare}
                onFinish={() => {
                  handleClose();
                  loadShares();
                }}
                onCancel={handleClose}
              />
            </Box>
          </DialogContent>
        </Dialog>
      </Container>
    </Box>
  );
}