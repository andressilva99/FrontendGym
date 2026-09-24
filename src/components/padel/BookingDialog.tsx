import { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import { createBooking, findBookingForSlot } from "../../api/bookings.api";
import type { BookingFormData, TimeSlot } from "../../types/padel.types";
import {
  dateKeyFromIso,
  formatDateKey,
  formatMoney,
  getErrorMessage,
  notifyBookingsChanged,
} from "../../utils/padel.utils";
import { escapeHtml, showError, showSuccessHtml } from "../../utils/alerts";

interface Props {
  slot: TimeSlot | null;
  onClose: () => void;
  // Se llama después de reservar (o si el turno dejó de estar disponible) para recargar los turnos
  onBooked: () => void;
}

const emptyForm: BookingFormData = { firstName: "", lastName: "", dni: "", email: "", whatsapp: "" };

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validate = (form: BookingFormData) => {
  const errors: Partial<Record<keyof BookingFormData, string>> = {};
  if (!form.firstName.trim()) errors.firstName = "Ingresá tu nombre";
  if (!form.lastName.trim()) errors.lastName = "Ingresá tu apellido";
  if (!/^\d{7,8}$/.test(form.dni)) errors.dni = "El DNI debe tener 7 u 8 números";
  if (!EMAIL_REGEX.test(form.email.trim())) errors.email = "Ingresá un email válido";
  if (!/^\d{8,15}$/.test(form.whatsapp)) errors.whatsapp = "Solo números, con código de área (ej: 3511234567)";
  return errors;
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Consulta hasta 2 veces (con 2s de margen) si la reserva quedó guardada en el back
const confirmBookingSaved = async (dni: number, date: string, timeslotId: string) => {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      if (await findBookingForSlot(dni, date, timeslotId)) return true;
    } catch {
      // si la verificación también falla, reintentamos una vez más
    }
    if (attempt === 0) await wait(2000);
  }
  return false;
};

export default function BookingDialog({ slot, onClose, onBooked }: Props) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [form, setForm] = useState<BookingFormData>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof BookingFormData, string>>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (slot) {
      setForm(emptyForm);
      setErrors({});
    }
  }, [slot]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numeric = name === "dni" || name === "whatsapp";
    setForm({ ...form, [name]: numeric ? value.replace(/\D/g, "") : value });
    setErrors({ ...errors, [name]: undefined });
  };

  const handleSubmit = async () => {
    if (!slot) return;

    const validation = validate(form);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    const email = form.email.trim();
    const dni = Number(form.dni);

    const showBooked = (emailNote: string) => {
      onClose();
      onBooked();
      notifyBookingsChanged();

      showSuccessHtml(
        "¡Turno reservado!",
        `<p><strong>${escapeHtml(slot.courtId?.name ?? "Cancha")}</strong></p>
         <p>${formatDateKey(dateKeyFromIso(slot.date))} de <strong>${escapeHtml(slot.startTime)}</strong> a <strong>${escapeHtml(slot.endTime)}</strong></p>
         <p>${emailNote} <strong>${escapeHtml(email)}</strong></p>`
      );
    };

    setSaving(true);
    try {
      await createBooking({
        timeslotId: slot._id,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        dni,
        email,
        whatsapp: Number(form.whatsapp),
      });

      showBooked("Te enviamos la confirmación a");
    } catch (error: unknown) {
      const err = error as { response?: { status?: number } };
      const status = err?.response?.status;
      const message = getErrorMessage(error, "No se pudo reservar el turno. Intentá nuevamente.");

      // Sin respuesta (timeout o corte): el back pudo haber guardado la reserva y quedarse
      // esperando al servidor de email. Verificamos antes de mostrar un error.
      if (!err?.response) {
        const booked = await confirmBookingSaved(dni, dateKeyFromIso(slot.date), slot._id);
        if (booked) {
          showBooked("La confirmación puede demorar unos minutos en llegar a");
        } else {
          showError(
            "El servidor está tardando en responder. Revisá tu email en unos minutos o intentá nuevamente; si el turno ya no aparece, es porque quedó reservado.",
            "No pudimos confirmar la reserva"
          );
          onBooked();
        }
        return;
      }

      // El turno ya fue tomado por otra persona o se eliminó: cerramos y refrescamos la grilla
      if (status === 400 && message.includes("disponible")) {
        onClose();
        onBooked();
        showError("Alguien reservó este horario recién. Elegí otro turno disponible.", "Turno no disponible");
      } else if (status === 404) {
        onClose();
        onBooked();
        showError(message, "Turno no disponible");
      } else {
        showError(message);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={!!slot}
      onClose={saving ? undefined : onClose}
      fullScreen={fullScreen}
      maxWidth="sm"
      fullWidth
      disableEnforceFocus
      slotProps={{ paper: { sx: { borderRadius: fullScreen ? 0 : 4 } } }}
    >
      <DialogTitle sx={{ fontWeight: 900, color: "#023e8a", display: "flex", alignItems: "center", gap: 1 }}>
        <EventAvailableIcon /> Reservar turno
      </DialogTitle>

      <DialogContent>
        {slot && (
          <Box
            sx={{
              p: 2,
              mb: 2,
              borderRadius: 3,
              color: "white",
              background: "linear-gradient(135deg, #023e8a 0%, #0077b6 100%)",
            }}
          >
            <Typography sx={{ fontWeight: 800, fontSize: 18 }}>{slot.courtId?.name ?? "Cancha"}</Typography>
            <Typography sx={{ opacity: 0.9 }}>{formatDateKey(dateKeyFromIso(slot.date))}</Typography>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1 }}>
              <Typography sx={{ fontWeight: 900, fontSize: 22 }}>
                {slot.startTime} - {slot.endTime}
              </Typography>
              <Typography sx={{ fontWeight: 900, fontSize: 20 }}>{formatMoney(slot.priceId?.amount)}</Typography>
            </Stack>
          </Box>
        )}

        <Stack spacing={2} mt={1}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="Nombre"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              error={!!errors.firstName}
              helperText={errors.firstName}
              fullWidth
            />
            <TextField
              label="Apellido"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              error={!!errors.lastName}
              helperText={errors.lastName}
              fullWidth
            />
          </Stack>
          <TextField
            label="DNI"
            name="dni"
            value={form.dni}
            onChange={handleChange}
            error={!!errors.dni}
            helperText={errors.dni}
            slotProps={{ htmlInput: { inputMode: "numeric", maxLength: 8 } }}
            fullWidth
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email ?? "Te vamos a enviar la confirmación del turno"}
            fullWidth
          />
          <TextField
            label="WhatsApp"
            name="whatsapp"
            value={form.whatsapp}
            onChange={handleChange}
            error={!!errors.whatsapp}
            helperText={errors.whatsapp}
            slotProps={{ htmlInput: { inputMode: "tel", maxLength: 15 } }}
            fullWidth
          />
        </Stack>

        <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
          <Button onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={saving}
            startIcon={saving ? <CircularProgress size={18} color="inherit" /> : undefined}
            sx={{
              fontWeight: 800,
              borderRadius: 2,
              px: 3,
              background: "linear-gradient(90deg, #023e8a, #0077b6)",
            }}
          >
            {saving ? "Reservando..." : "Confirmar reserva"}
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
