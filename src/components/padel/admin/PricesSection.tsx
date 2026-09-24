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
import { createPrice, deletePrice, updatePrice } from "../../../api/prices.api";
import type { Court, Price, PriceFormData } from "../../../types/padel.types";
import { formatMoney, getErrorMessage } from "../../../utils/padel.utils";
import { confirmAction, showError, showSuccess, showWarning } from "../../../utils/alerts";

interface Props {
  prices: Price[];
  courts: Court[];
  onChanged: () => void;
}

const emptyForm: PriceFormData = { amount: "", description: "", type: "padel", courtId: "", active: true };

const getCourtId = (price: Price) => (typeof price.courtId === "object" && price.courtId ? price.courtId._id : String(price.courtId));

export default function PricesSection({ prices, courts, onChanged }: Props) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Price | null>(null);
  const [form, setForm] = useState<PriceFormData>(emptyForm);
  const [saving, setSaving] = useState(false);

  const courtName = (price: Price) =>
    typeof price.courtId === "object" && price.courtId
      ? price.courtId.name
      : courts.find((c) => c._id === price.courtId)?.name ?? "Cancha eliminada";

  const handleOpenCreate = () => {
    if (courts.length === 0) {
      showWarning("Primero tenés que crear una cancha para poder asignarle un precio.");
      return;
    }
    setEditing(null);
    setForm({ ...emptyForm, courtId: courts[0]._id });
    setOpen(true);
  };

  const handleOpenEdit = (price: Price) => {
    setEditing(price);
    setForm({
      amount: String(price.amount),
      description: price.description,
      type: price.type,
      courtId: getCourtId(price),
      active: price.active,
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditing(null);
  };

  const handleCourtChange = (courtId: string) => {
    const court = courts.find((c) => c._id === courtId);
    setForm({ ...form, courtId, type: court?.type ?? form.type });
  };

  const handleSubmit = async () => {
    if (form.amount === "" || Number(form.amount) < 0 || !form.description.trim() || !form.courtId) {
      showWarning("Completá el monto, la descripción y la cancha.");
      return;
    }

    const payload = {
      amount: Number(form.amount),
      description: form.description.trim(),
      type: form.type,
      courtId: form.courtId,
      active: form.active,
    };

    setSaving(true);
    try {
      if (editing) await updatePrice(editing._id, payload);
      else await createPrice(payload);
      handleClose();
      onChanged();
      showSuccess(editing ? "¡Precio actualizado!" : "¡Precio creado!");
    } catch (error) {
      showError(getErrorMessage(error, "No se pudo guardar el precio."));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (price: Price) => {
    const confirmed = await confirmAction(
      `¿Eliminar "${price.description}"?`,
      "Los turnos que usan este precio quedarán sin monto. Si ya no lo usás, podés desactivarlo.",
      "Sí, eliminar"
    );
    if (!confirmed) return;

    try {
      await deletePrice(price._id);
      onChanged();
      showSuccess("Precio eliminado");
    } catch (error) {
      showError(getErrorMessage(error, "No se pudo eliminar el precio."));
    }
  };

  return (
    <>
      <SectionHeader title="Precios" subtitle={`${prices.length} precios registrados`}>
        <Button
          variant="contained"
          onClick={handleOpenCreate}
          sx={{ bgcolor: "#1877F2", textTransform: "none", borderRadius: 2, whiteSpace: "nowrap" }}
        >
          Nuevo Precio
        </Button>
      </SectionHeader>

      <Box sx={{ overflowX: "auto" }}>
        <TableContainer sx={{ boxShadow: "none" }}>
          <Table>
            <TableHead sx={{ bgcolor: "#f5f5f5" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Descripción</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Cancha</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Monto</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Estado</TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {prices.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4, color: "#6b7280" }}>
                    Todavía no cargaste precios.
                  </TableCell>
                </TableRow>
              )}
              {prices.map((p) => (
                <TableRow key={p._id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{p.description}</TableCell>
                  <TableCell>{courtName(p)}</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#1877F2" }}>{formatMoney(p.amount)}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={p.active ? "Activo" : "Inactivo"}
                      color={p.active ? "success" : "default"}
                      sx={{ fontWeight: 700 }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleOpenEdit(p)} color="primary">
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(p)} color="error">
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
        <DialogTitle sx={{ fontWeight: 700 }}>{editing ? "Editar Precio" : "Crear Precio"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              select
              label="Cancha"
              value={form.courtId}
              onChange={(e) => handleCourtChange(e.target.value)}
              fullWidth
            >
              {courts.map((c) => (
                <MenuItem key={c._id} value={c._id}>
                  {c.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Descripción"
              placeholder="Ej: Turno 1 hora - Noche"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              fullWidth
            />
            <TextField
              label="Monto ($)"
              type="number"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              fullWidth
            />
            <FormControlLabel
              control={<Switch checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />}
              label="Precio activo"
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
