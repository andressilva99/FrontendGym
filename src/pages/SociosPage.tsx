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
} from "@mui/material";
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

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [formData, setFormData] = useState<SocioFormData>({
    apellido: "",
    nombre: "",
    fechaNacimiento: "",
    trainerId: "",
  });

  const loadData = async () => {
    const [sociosData, trainersData] = await Promise.all([
      getSocios(),
      getTrainers(),
    ]);
    setSocios(sociosData);
    setTrainers(trainersData);
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
      typeof socio.trainerId === "object"
        ? socio.trainerId._id
        : socio.trainerId;

    setEditing(socio);
    setFormData({
      apellido: socio.apellido,
      nombre: socio.nombre,
      fechaNacimiento: socio.fechaNacimiento.substring(0, 10),
      trainerId,
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
      {/* ===== HEADER (Logo + Título de la App) ===== */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: { xs: 1, sm: 1.5 },
          mb: { xs: 2, sm: 3 },
        }}
      >
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
          {/* Header de la Card */}
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
                  Gestión de Socios
                </Typography>
                <Typography
                  sx={{
                    mt: 0.8,
                    color: "#6b7280",
                    fontSize: { xs: 13, sm: 14 },
                  }}
                >
                  Administrá los datos de los socios, sus entrenadores y membresías.
                </Typography>
              </Box>

              <Button
                variant="contained"
                onClick={handleOpenCreate}
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
                Nuevo Socio
              </Button>
            </Stack>
          </Box>

          {/* Tabla de Socios */}
          <Box sx={{ overflowX: "auto" }}>
            <SocioTable
              socios={socios}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
            />
          </Box>
        </Box>

        {/* Modal de Formulario */}
        <Dialog
          open={open}
          onClose={handleClose}
          fullScreen={fullScreen}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ fontWeight: 700 }}>
            {editing ? "Editar Socio" : "Crear Socio"}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 1 }}>
              <SocioForm
                formData={formData}
                trainers={trainers}
                editing={!!editing}
                onChange={handleChange}
              />
              <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
                <Button onClick={handleClose} sx={{ color: "#6b7280", textTransform: "none" }}>
                    Cancelar
                </Button>
                <Button 
                    variant="contained" 
                    onClick={handleSubmit}
                    sx={{ bgcolor: "#1877F2", textTransform: "none", borderRadius: 1.5 }}
                >
                    {editing ? "Guardar cambios" : "Crear socio"}
                </Button>
              </Stack>
            </Box>
          </DialogContent>
        </Dialog>
      </Container>
    </Box>
  );
};