import {
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  FormControl,
  InputLabel,
  Typography,
  Checkbox,
} from "@mui/material";
import { useState, useMemo } from "react";
import type { Share, Socio } from "../../types/payment.types";

interface Props {
  shares: Share[];
  socios: Socio[];
  onGenerate: (data: {
    year: number;
    month: number;
    shareId: string;
    socioIds: string[];
  }) => void;
  onCancel: () => void;
}

const months = [
  { value: 1, label: "Enero" },
  { value: 2, label: "Febrero" },
  { value: 3, label: "Marzo" },
  { value: 4, label: "Abril" },
  { value: 5, label: "Mayo" },
  { value: 6, label: "Junio" },
  { value: 7, label: "Julio" },
  { value: 8, label: "Agosto" },
  { value: 9, label: "Septiembre" },
  { value: 10, label: "Octubre" },
  { value: 11, label: "Noviembre" },
  { value: 12, label: "Diciembre" },
];

const formatDate = (date: any) => {
  if (!date) return "N/A";
  const d = new Date(date);
  return d.toLocaleDateString("es-AR");
};

export const PaymentGenerateForm = ({
  shares,
  socios,
  onGenerate,
  onCancel,
}: Props) => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [shareId, setShareId] = useState("");
  const [selectedSocios, setSelectedSocios] = useState<string[]>([]);

  // 🔹 Ordenar Cuotas: Más reciente a más antigua
  const sortedShares = useMemo(() => {
    return [...shares].sort((a, b) => 
      new Date(b.quoteDate).getTime() - new Date(a.quoteDate).getTime()
    );
  }, [shares]);

  // 🔹 Ordenar Alumnos: Alfabéticamente por Apellido y Nombre
  const sortedSocios = useMemo(() => {
    return [...socios].sort((a, b) => {
      const nameA = `${a.apellido} ${a.nombre}`.toLowerCase();
      const nameB = `${b.apellido} ${b.nombre}`.toLowerCase();
      return nameA.localeCompare(nameB);
    });
  }, [socios]);

  const allSelected = sortedSocios.length > 0 && selectedSocios.length === sortedSocios.length;
  const isIndeterminate = selectedSocios.length > 0 && selectedSocios.length < sortedSocios.length;

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedSocios([]);
    } else {
      setSelectedSocios(sortedSocios.map((s) => s._id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate({
      year,
      month,
      shareId,
      socioIds: selectedSocios,
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Box display="flex" flexDirection="column" gap={3} mt={2}>
        
        <TextField
          label="Año"
          type="number"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          fullWidth
        />

        <FormControl fullWidth>
          <InputLabel>Mes</InputLabel>
          <Select
            value={month}
            label="Mes"
            onChange={(e) => setMonth(Number(e.target.value))}
          >
            {months.map((m) => (
              <MenuItem key={m.value} value={m.value}>
                {m.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth required>
          <InputLabel>Cuota</InputLabel>
          <Select
            value={shareId}
            label="Cuota"
            onChange={(e) => setShareId(e.target.value)}
          >
            {sortedShares.map((share) => (
              <MenuItem key={share._id} value={share._id}>
                ${share.amount} - {share.numberDays} días - Vigencia: {formatDate(share.quoteDate)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box>
          <Typography variant="subtitle1" mb={1} sx={{ fontWeight: 'bold' }}>
            Seleccionar Socios
          </Typography>

          <Box display="flex" alignItems="center" mb={1}>
            <Checkbox
              checked={allSelected}
              indeterminate={isIndeterminate}
              onChange={handleSelectAll}
            />
            <Typography>
              Seleccionar todos ({selectedSocios.length})
            </Typography>
          </Box>

          <Box
            sx={{
              border: "1px solid #ddd",
              borderRadius: 2,
              maxHeight: 200,
              overflowY: "auto",
              p: 1,
              backgroundColor: "#fafafa",
            }}
          >
            {sortedSocios.map((socio) => {
              const isChecked = selectedSocios.includes(socio._id);

              return (
                <Box key={socio._id} display="flex" alignItems="center">
                  <Checkbox
                    checked={isChecked}
                    onChange={() => {
                      if (isChecked) {
                        setSelectedSocios(selectedSocios.filter((id) => id !== socio._id));
                      } else {
                        setSelectedSocios([...selectedSocios, socio._id]);
                      }
                    }}
                  />
                  <Typography>
                    {socio.apellido}, {socio.nombre}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>

        <Box display="flex" justifyContent="flex-end" gap={2}>
          <Button variant="outlined" onClick={onCancel}>
            Cancelar
          </Button>

          <Button 
            type="submit" 
            variant="contained" 
            disabled={!shareId || selectedSocios.length === 0}
            sx={{ bgcolor: "#1877F2" }}
          >
            Generar pagos
          </Button>
        </Box>
      </Box>
    </Box>
  );
};