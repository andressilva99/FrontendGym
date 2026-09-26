import {
  Alert,
  Box,
  Button,
  FormControlLabel,
  Paper,
  Switch,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import type { Share } from "../../types/share.types";
import { createShare, updateShare } from "../../api/shares.api";
import { getErrorMessage } from "../../utils/padel.utils";
import { showError, showSuccess, showWarning } from "../../utils/alerts";

const INTEGER_ONLY_MSG = "Solo números enteros, sin puntos ni comas";

interface Props {
  share: Share | null;
  onFinish: () => void;
  onCancel: () => void;
}

export default function ShareForm({ share, onFinish, onCancel }: Props) {
  const [form, setForm] = useState({
    numberDays: "",
    amount: "",
    quoteDate: "",
    active: true,
  });
  const [saving, setSaving] = useState(false);
  const [invalidField, setInvalidField] = useState<"numberDays" | "amount" | null>(null);

  // Solo dígitos: si escriben o pegan un punto, coma u otro caracter, no se acepta y se avisa
  // (así "20.000" no se guarda como 20 ni "20,5" como 205 sin que se note)
  const handleIntegerChange = (field: "numberDays" | "amount", value: string) => {
    if (!/^\d*$/.test(value)) {
      setInvalidField(field);
      return;
    }
    setInvalidField(null);
    setForm({ ...form, [field]: value });
  };

  // Formatea la fecha para que el input type="date" la reconozca (YYYY-MM-DD)
  const formatDateForInput = (date: string | Date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (share) {
      setForm({
        numberDays: String(share.numberDays),
        amount: String(share.amount),
        quoteDate: formatDateForInput(share.quoteDate),
        active: share.active !== false,
      });
    } else {
      // Por defecto sugerimos la fecha de hoy al crear
      setForm({
        numberDays: "",
        amount: "",
        quoteDate: formatDateForInput(new Date()),
        active: true,
      });
    }
  }, [share]);

  const submit = async () => {
    // 🔹 CORRECCIÓN: Validamos contra string vacío. Si es "0", es válido.
    if (form.numberDays === "" || form.amount === "" || !form.quoteDate) {
      showWarning("Completá la cantidad de días, el monto y la fecha de vigencia.");
      return;
    }

    if (!/^\d+$/.test(form.numberDays)) {
      showWarning("La cantidad de días tiene que ser un número entero, sin puntos ni comas.");
      return;
    }
    if (!/^\d+$/.test(form.amount)) {
      showWarning("El monto tiene que ser un número entero, sin puntos ni comas (ej: 25000).");
      return;
    }

    const numberDays = Number(form.numberDays);
    const amount = Number(form.amount);

    const payload = {
      numberDays,
      amount,
      // Ajuste para evitar desfase horario al guardar solo fecha
      quoteDate: new Date(form.quoteDate + "T00:00:00"),
      active: form.active,
    };

    setSaving(true);
    try {
      if (share) {
        await updateShare(share._id, payload);
      } else {
        await createShare(payload);
      }
      onFinish();
      showSuccess(
        share ? "¡Cuota actualizada!" : "¡Cuota creada!",
        form.active ? "Ya está disponible para generar pagos." : "Quedó inactiva: no aparece al generar pagos."
      );
    } catch (error) {
      console.error("Error al guardar la cuota:", error);
      showError(
        getErrorMessage(error, share ? "No se pudo actualizar la cuota." : "No se pudo crear la cuota."),
        share ? "Error al actualizar" : "Error al crear"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Paper elevation={0} sx={{ p: 1, maxWidth: 420, margin: "auto" }}>
      <Box display="grid" gap={3}>
        <TextField
          label="Cantidad de días"
          value={form.numberDays}
          onChange={e => handleIntegerChange("numberDays", e.target.value)}
          fullWidth
          error={invalidField === "numberDays"}
          helperText={invalidField === "numberDays" ? INTEGER_ONLY_MSG : "Usa 0 para cuotas sin vencimiento"}
          inputProps={{ inputMode: "numeric" }}
        />

        <TextField
          label="Monto ($)"
          value={form.amount}
          onChange={e => handleIntegerChange("amount", e.target.value)}
          fullWidth
          error={invalidField === "amount"}
          helperText={invalidField === "amount" ? INTEGER_ONLY_MSG : "Sin puntos ni comas (ej: 25000). Usa 0 para becas o invitados"}
          inputProps={{ inputMode: "numeric" }}
        />

        <TextField
          label="Vigente desde"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={form.quoteDate}
          onChange={e => setForm({ ...form, quoteDate: e.target.value })}
          fullWidth
        />

        <FormControlLabel
          control={
            <Switch
              checked={form.active}
              onChange={e => setForm({ ...form, active: e.target.checked })}
            />
          }
          label={form.active ? "Cuota activa (se puede usar al generar pagos)" : "Cuota inactiva (no aparece al generar pagos)"}
        />

        <Alert severity="info" sx={{ fontSize: 13 }}>
          Si cambia el precio, creá una cuota nueva y desactivá la anterior. Los pagos ya
          generados conservan el monto con el que se crearon.
        </Alert>

        <Box display="flex" gap={2} mt={1}>
          <Button 
            fullWidth 
            variant="outlined" 
            onClick={onCancel} 
            color="inherit"
          >
            Cancelar
          </Button>
          <Button 
            fullWidth 
            variant="contained" 
            onClick={submit}
            // Si falta algún dato, submit avisa con SweetAlert en vez de deshabilitar el botón
            disabled={saving}
            sx={{
              bgcolor: "#1877F2",
              "&:hover": { bgcolor: "#1565C0" }
            }}
          >
            {saving ? "Guardando..." : share ? "Actualizar" : "Crear Cuota"}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}