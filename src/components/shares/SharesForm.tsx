import {
  Box,
  Button,
  Paper,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import type { Share } from "../../types/share.types";
import { createShare, updateShare } from "../../api/shares.api";

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
  });

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
      });
    } else {
      // Por defecto sugerimos la fecha de hoy al crear
      setForm({ 
        numberDays: "", 
        amount: "", 
        quoteDate: formatDateForInput(new Date()) 
      });
    }
  }, [share]);

  const submit = async () => {
    // 🔹 CORRECCIÓN: Validamos contra string vacío. Si es "0", es válido.
    if (form.numberDays === "" || form.amount === "" || !form.quoteDate) {
      return; 
    }

    const payload = {
      numberDays: Number(form.numberDays),
      amount: Number(form.amount),
      // Ajuste para evitar desfase horario al guardar solo fecha
      quoteDate: new Date(form.quoteDate + "T00:00:00"),
    };

    try {
      if (share) {
        await updateShare(share._id, payload);
      } else {
        await createShare(payload);
      }
      onFinish();
    } catch (error) {
      console.error("Error al guardar la cuota:", error);
    }
  };

  return (
    <Paper elevation={0} sx={{ p: 1, maxWidth: 420, margin: "auto" }}>
      <Box display="grid" gap={3}>
        <TextField
          label="Cantidad de días"
          type="number"
          value={form.numberDays}
          onChange={e => setForm({ ...form, numberDays: e.target.value })}
          fullWidth
          helperText="Usa 0 para cuotas sin vencimiento"
          inputProps={{ min: 0 }}
        />

        <TextField
          label="Monto ($)"
          type="number"
          value={form.amount}
          onChange={e => setForm({ ...form, amount: e.target.value })}
          fullWidth
          helperText="Usa 0 para becas o invitados"
          inputProps={{ min: 0 }}
        />

        <TextField
          label="Vigente desde"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={form.quoteDate}
          onChange={e => setForm({ ...form, quoteDate: e.target.value })}
          fullWidth
        />

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
            // 🔹 El botón se habilita aunque el valor sea "0"
            disabled={form.amount === "" || form.numberDays === "" || !form.quoteDate}
            sx={{ 
              bgcolor: "#1877F2",
              "&:hover": { bgcolor: "#1565C0" }
            }}
          >
            {share ? "Actualizar" : "Crear Cuota"}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}