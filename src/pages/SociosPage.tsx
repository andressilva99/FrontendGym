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
  TextField,
  InputAdornment
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { getSocios, createSocio, updateSocio, deleteSocio, getTrainers } from "../api/socio.api";
import type { Socio, Trainer, SocioFormData } from "../types/socio.types";
import { SocioForm } from "../components/socio/SocioForm";
import { SocioTable } from "../components/socio/SocioTable";

const MySwal = withReactContent(Swal);

export const SociosPage = () => {
  const [socios, setSocios] = useState<Socio[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [editing, setEditing] = useState<Socio | null>(null);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [formData, setFormData] = useState<SocioFormData>({
    apellido: "", nombre: "", fechaNacimiento: "", trainerId: "",
  });

  const loadData = async () => {
    try {
      const [sociosData, trainersData] = await Promise.all([getSocios(), getTrainers()]);
      setSocios(sociosData);
      setTrainers(trainersData);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    }
  };

  useEffect(() => { loadData(); }, []);

  // 🔹 LÓGICA DE FILTRADO Y ORDENAMIENTO ALFABÉTICO
  const filteredSocios = useMemo(() => {
    // 1. Filtrar
    const result = socios.filter((s) => {
      const search = searchTerm.toLowerCase();
      const nombreSocio = `${s.nombre} ${s.apellido}`.toLowerCase();
      const nombreTrainer = typeof s.trainerId === 'object' && s.trainerId !== null 
        ? (s.trainerId as any).username?.toLowerCase() || "" 
        : "";
      
      return nombreSocio.includes(search) || nombreTrainer.includes(search);
    });

    // 2. Ordenar Alfabéticamente (Apellido, luego Nombre)
    return [...result].sort((a, b) => {
      const fullA = `${a.apellido} ${a.nombre}`.toLowerCase();
      const fullB = `${b.apellido} ${b.nombre}`.toLowerCase();
      return fullA.localeCompare(fullB, 'es', { sensitivity: 'base' });
    });
  }, [socios, searchTerm]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOpenCreate = () => {
    setEditing(null);
    setFormData({ apellido: "", nombre: "", fechaNacimiento: "", trainerId: "" });
    setOpen(true);
  };

  const handleOpenEdit = (socio: Socio) => {
    const trainerId = typeof socio.trainerId === "object" && socio.trainerId !== null
        ? socio.trainerId._id : socio.trainerId;
    setEditing(socio);
    setFormData({
      apellido: socio.apellido,
      nombre: socio.nombre,
      fechaNacimiento: socio.fechaNacimiento ? socio.fechaNacimiento.substring(0, 10) : "",
      trainerId: trainerId || "",
    });
    setOpen(true);
  };

  const handleClose = () => { setOpen(false); setEditing(null); };

  const handleSubmit = async () => {
    try {
      if (editing) { await updateSocio(editing._id, formData); } 
      else { await createSocio(formData); }
      handleClose();
      loadData();
      MySwal.fire({
        title: editing ? '¡Actualizado!' : '¡Creado!',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      MySwal.fire({ title: 'Error', icon: 'error' });
    }
  };

  const handleDelete = async (id: string) => {
    MySwal.fire({
      title: '¿Eliminar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1877F2',
      confirmButtonText: 'Eliminar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteSocio(id);
          loadData();
          MySwal.fire({ title: 'Eliminado', icon: 'success', timer: 1000, showConfirmButton: false });
        } catch (error) { MySwal.fire({ title: 'Error', icon: 'error' }); }
      }
    });
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7fb", px: { xs: 1.5, sm: 3, md: 4 }, py: { xs: 2, sm: 3 } }}>
      {/* HEADER */}
      <Box sx={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box component="img" src="/logo.png" sx={{ width: 56, height: 56, borderRadius: "50%" }} />
          <Typography sx={{ fontWeight: 800, color: "#1877F2" }}>Oxígeno Espacio Deportivo</Typography>
        </Box>
        <IconButton onClick={() => navigate("/")} sx={{ color: "#1877F2", bgcolor: "rgba(24, 119, 242, 0.05)" }}>
          <HomeIcon fontSize="large" />
        </IconButton>
      </Box>

      <Container maxWidth={false} sx={{ maxWidth: 2000, mx: "auto" }}>
        <Box sx={{ bgcolor: "white", borderRadius: 3, boxShadow: "0 10px 30px rgba(0,0,0,0.08)", overflow: "hidden" }}>
          
          {/* BARRA DE BÚSQUEDA Y TÍTULO */}
          <Box sx={{ p: 3, borderBottom: "1px solid #eee" }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 900 }}>Gestión de Socios</Typography>
                <Typography variant="body2" color="textSecondary">
                  {filteredSocios.length} socios encontrados
                </Typography>
              </Box>
              
              <Stack direction="row" spacing={2} sx={{ width: { xs: '100%', md: 'auto' } }}>
                <TextField
                  placeholder="Buscar socio o entrenador..."
                  size="small"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  sx={{ 
                    width: { xs: '100%', sm: 300 },
                    '& .MuiOutlinedInput-root': { borderRadius: 2 }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: '#999' }} />
                      </InputAdornment>
                    ),
                  }}
                />
                <Button 
                  variant="contained" 
                  onClick={handleOpenCreate} 
                  sx={{ bgcolor: "#1877F2", textTransform: 'none', borderRadius: 2, whiteSpace: 'nowrap' }}
                >
                  Nuevo Socio
                </Button>
              </Stack>
            </Stack>
          </Box>

          <Box sx={{ overflowX: "auto" }}>
            <SocioTable
              socios={filteredSocios}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
            />
          </Box>
        </Box>

        {/* DIALOG FORMULARIO */}
        <Dialog open={open} onClose={handleClose} fullScreen={fullScreen} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 700 }}>{editing ? "Editar Socio" : "Crear Socio"}</DialogTitle>
          <DialogContent>
            <SocioForm formData={formData} trainers={trainers} editing={!!editing} onChange={handleChange} />
            <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
              <Button onClick={handleClose}>Cancelar</Button>
              <Button variant="contained" onClick={handleSubmit} sx={{ bgcolor: "#1877F2" }}>Guardar</Button>
            </Stack>
          </DialogContent>
        </Dialog>
      </Container>
    </Box>
  );
};