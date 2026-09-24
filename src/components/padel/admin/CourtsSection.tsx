import { useState } from "react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  MenuItem,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import SectionHeader from "./SectionHeader";
import { createCourt, deleteCourt, updateCourt } from "../../../api/courts.api";
import type { Court, CourtFormData } from "../../../types/padel.types";
import { getErrorMessage } from "../../../utils/padel.utils";
import { confirmAction, showError, showSuccess, showWarning } from "../../../utils/alerts";

interface Props {
  courts: Court[];
  onChanged: () => void;
}

const emptyForm: CourtFormData = { number: "", name: "", type: "padel", active: true };

export default function CourtsSection({ courts, onChanged }: Props) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Court | null>(null);
  const [form, setForm] = useState<CourtFormData>(emptyForm);
  const [saving, setSaving] = useState(false);

  const handleOpenCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const handleOpenEdit = (court: Court) => {
    setEditing(court);
    setForm({ number: String(court.number), name: court.name, type: court.type, active: court.active });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditing(null);
  };

  const handleSubmit = async () => {
    if (!form.number || Number(form.number) <= 0 || !form.name.trim()) {
      showWarning("Completá el número y el nombre de la cancha.");
      return;
    }

    const payload = {
      number: Number(form.number),
      name: form.name.trim(),
      type: form.type,
      active: form.active,
    };

    setSaving(true);
    try {
      if (editing) await updateCourt(editing._id, payload);
      else await createCourt(payload);
      handleClose();
      onChanged();
      showSuccess(editing ? "¡Cancha actualizada!" : "¡Cancha creada!");
    } catch (error) {
      showError(getErrorMessage(error, "No se pudo guardar la cancha."));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (court: Court) => {
    const confirmed = await confirmAction(
      `¿Eliminar ${court.name}?`,
      "Los precios y turnos asociados a esta cancha dejarán de funcionar. Si solo querés pausarla, desactivala.",
      "Sí, eliminar"
    );
    if (!confirmed) return;

    try {
      await deleteCourt(court._id);
      onChanged();
      showSuccess("Cancha eliminada");
    } catch (error) {
      showError(getErrorMessage(error, "No se pudo eliminar la cancha."));
    }
  };

  return (
    <>
      <SectionHeader title="Canchas" subtitle={`${courts.length} canchas registradas`}>
        <Button
          variant="contained"
          onClick={handleOpenCreate}
          sx={{ bgcolor: "#1877F2", textTransform: "none", borderRadius: 2, whiteSpace: "nowrap" }}
        >
          Nueva Cancha
        </Button>
      </SectionHeader>

      <Box sx={{ overflowX: "auto" }}>
        <TableContainer sx={{ boxShadow: "none" }}>
          <Table>
            <TableHead sx={{ bgcolor: "#f5f5f5" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Número</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Nombre</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Tipo</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Estado</TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4, color: "#6b7280" }}>
                    Todavía no cargaste canchas. Empezá creando una.
                  </TableCell>
                </TableRow>
              )}
              {courts.map((c) => (
                <TableRow key={c._id} hover>
                  <TableCell>{c.number}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{c.name}</TableCell>
                  <TableCell sx={{ textTransform: "capitalize" }}>{c.type}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={c.active ? "Activa" : "Inactiva"}
                      color={c.active ? "success" : "default"}
                      sx={{ fontWeight: 700 }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleOpenEdit(c)} color="primary">
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(c)} color="error">
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Dialog open={open} onClose={handleClose} fullScreen={fullScreen} maxWidth="sm" fullWidth disableEnforceFocus>
        <DialogTitle sx={{ fontWeight: 700 }}>{editing ? "Editar Cancha" : "Crear Cancha"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Número"
              type="number"
              value={form.number}
              onChange={(e) => setForm({ ...form, number: e.target.value })}
              fullWidth
            />
            <TextField
              label="Nombre"
              placeholder="Ej: Cancha 1 - Padel"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              fullWidth
            />
            <TextField
              select
              label="Tipo"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              helperText="Solo las canchas de padel se muestran en el turnero público"
              fullWidth
            >
              <MenuItem value="padel">Padel</MenuItem>
              <MenuItem value="gym">Gym</MenuItem>
            </TextField>
            <FormControlLabel
              control={<Switch checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />}
              label="Cancha activa"
            />
          </Stack>
          <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
            <Button onClick={handleClose} disabled={saving}>
              Cancelar
            </Button>
            <Button variant="contained" onClick={handleSubmit} disabled={saving} sx={{ bgcolor: "#1877F2" }}>
              {saving ? "Guardando..." : "Guardar"}
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
}
