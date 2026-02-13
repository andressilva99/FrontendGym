import { useEffect, useState } from "react";
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
} from "@mui/material";
import { useNavigate } from "react-router-dom"; // Importamos el hook para navegar
import HomeIcon from '@mui/icons-material/Home'; // Importamos el icono

import {
  getSocios,
  createSocio,
  updateSocio,
  deleteSocio,
  getTrainers,
} from "../api/socio.api";
import type {
  Socio,
  Trainer,
  SocioFormData,
} from "../types/socio.types";
import { SocioForm } from "../components/socio/SocioForm";
import { SocioTable } from "../components/socio/SocioTable";

export const SociosPage = () => {
  const [socios, setSocios] = useState<Socio[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [editing, setEditing] = useState<Socio | null>(null);
  const [open, setOpen] = useState(false);

  const navigate = useNavigate(); // Inicializamos la navegación
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [formData, setFormData] = useState<SocioFormData>({
    apellido: "",
    nombre: "",
    fechaNacimiento: "",
    trainerId: "",
  });

  const loadData = async () => {
    try {
      const [sociosData, trainersData] = await Promise.all([
        getSocios(),
        getTrainers(),
      ]);
      setSocios(sociosData);
      setTrainers(trainersData);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleOpenCreate = () => {
    setEditing(null);
    setFormData({
      apellido: "",
      nombre: "",
      fechaNacimiento: "",
      trainerId: "",
    });
    setOpen(true);
  };

  const handleOpenEdit = (socio: Socio) => {
    const trainerId =
      typeof socio.trainerId === "object" && socio.trainerId !== null
        ? socio.trainerId._id
        : socio.trainerId;

    setEditing(socio);
    setFormData({
      apellido: socio.apellido,
      nombre: socio.nombre,
      fechaNacimiento: socio.fechaNacimiento ? socio.fechaNacimiento.substring(0, 10) : "",
      trainerId: trainerId || "",
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditing(null);
  };

  const handleSubmit = async () => {
    if (editing) {
      await updateSocio(editing._id, formData);
    } else {
      await createSocio(formData);
    }
    handleClose();
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Eliminar socio?")) return;
    await deleteSocio(id);
    loadData();
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
      {/* ===== HEADER CON BOTÓN HOME ===== */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between", // Separa el logo del botón Home
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

        {/* BOTÓN HOME */}
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
      <Container maxWidth={false} sx={{ maxWidth: 2000, mx: "auto" }}>
        <Box sx={{ bgcolor: "white", borderRadius: 3, boxShadow: "0 10px 30px rgba(0,0,0,0.08)", overflow: "hidden" }}>
          <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: "1px solid #eee" }}>
            <Typography variant="h4" sx={{ fontWeight: 900 }}>Gestión de Socios</Typography>
            <Button variant="contained" onClick={handleOpenCreate} sx={{ bgcolor: "#1877F2" }}>
              Nuevo Socio
            </Button>
          </Box>

          <Box sx={{ overflowX: "auto" }}>
            <SocioTable
              socios={socios}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
            />
          </Box>
        </Box>

        <Dialog open={open} onClose={handleClose} fullScreen={fullScreen} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 700 }}>
            {editing ? "Editar Socio" : "Crear Socio"}
          </DialogTitle>
          <DialogContent>
            <SocioForm
              formData={formData}
              trainers={trainers}
              editing={!!editing}
              onChange={handleChange}
            />
            <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
              <Button onClick={handleClose}>Cancelar</Button>
              <Button variant="contained" onClick={handleSubmit} sx={{ bgcolor: "#1877F2" }}>
                {editing ? "Guardar cambios" : "Crear socio"}
              </Button>
            </Stack>
          </DialogContent>
        </Dialog>
      </Container>
    </Box>
  );
};