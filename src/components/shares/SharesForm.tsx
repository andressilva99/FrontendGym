import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
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

  useEffect(() => {
    if (share) {
      setForm({
        numberDays: String(share.numberDays),
        amount: String(share.amount),
        quoteDate: share.quoteDate.slice(0, 10),
      });
    } else {
      setForm({ numberDays: "", amount: "", quoteDate: "" });
    }
  }, [share]);

  const submit = async () => {
    const payload = {
      numberDays: Number(form.numberDays),
      amount: Number(form.amount),
      quoteDate: form.quoteDate,
    };

    if (share) {
      await updateShare(share._id, payload);
    } else {
      await createShare(payload);
    }

    onFinish();
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 420, margin: "auto" }}>
      <Typography variant="h6" mb={2} textAlign="center">
        {share ? "Editar Cuota" : "Crear Cuota"}
      </Typography>

      <Box display="grid" gap={2}>
        <TextField
          label="Cantidad de días"
          type="number"
          value={form.numberDays}
          onChange={e =>
            setForm({ ...form, numberDays: e.target.value })
          }
          fullWidth
        />

        <TextField
          label="Monto"
          type="number"
          value={form.amount}
          onChange={e =>
            setForm({ ...form, amount: e.target.value })
          }
          fullWidth
        />

        <TextField
          label="Vigente desde"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={form.quoteDate}
          onChange={e =>
            setForm({ ...form, quoteDate: e.target.value })
          }
          fullWidth
        />

        <Box display="flex" gap={2}>
          <Button fullWidth variant="outlined" onClick={onCancel}>
            Cancelar
          </Button>
          <Button fullWidth variant="contained" onClick={submit}>
            {share ? "Actualizar" : "Crear"}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}