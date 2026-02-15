import {
  TextField,
  MenuItem,
  Stack,
} from "@mui/material";

import type { Trainer, SocioFormData } from "../../types/socio.types";

interface Props {
  formData: SocioFormData;
  trainers: Trainer[];
  editing: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SocioForm = ({
  formData,
  trainers,
  onChange,
}: Props) => {
  return (
    <Stack spacing={2} mt={1}>
      <TextField
        label="Apellido"
        name="apellido"
        value={formData.apellido}
        onChange={onChange}
        fullWidth
      />

      <TextField
        label="Nombre"
        name="nombre"
        value={formData.nombre}
        onChange={onChange}
        fullWidth
      />

      <TextField
        type="date"
        label="Fecha de Nacimiento"
        name="fechaNacimiento"
        value={formData.fechaNacimiento}
        onChange={onChange}
        InputLabelProps={{ shrink: true }}
        fullWidth
      />

      <TextField
        select
        label="Entrenador"
        name="trainerId"
        value={formData.trainerId}
        onChange={onChange}
        fullWidth
      >
        {trainers.map((t) => (
          <MenuItem key={t._id} value={t._id}>
            {t.username}
          </MenuItem>
        ))}
      </TextField>
    </Stack>
  );
};