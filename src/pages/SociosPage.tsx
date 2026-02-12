import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Add } from "@mui/icons-material";

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

import { SocioForm } from "../components/users/socio/SocioForm";
import { SocioTable } from "../components/users/socio/SocioTable";

export const SociosPage = () => {
  const [socios, setSocios] = useState<Socio[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [editing, setEditing] = useState<Socio | null>(null);
  const [open, setOpen] = useState(false);

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
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

  const handleSubmit = async () => {
    if (editing) {
      await updateSocio(editing._id, formData);
    } else {
      await createSocio(formData);
    }

    setOpen(false);
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Eliminar socio?")) return;
    await deleteSocio(id);
    loadData();
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Typography variant="h4" mb={3}>
        Gestión de Socios
      </Typography>

      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={handleOpenCreate}
        sx={{ mb: 3 }}
      >
        Nuevo Socio
      </Button>

      <SocioTable
        socios={socios}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
      />

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>
          {editing ? "Editar Socio" : "Crear Socio"}
        </DialogTitle>

        <DialogContent>
          <SocioForm
            formData={formData}
            trainers={trainers}
            editing={!!editing}
            onChange={handleChange}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};