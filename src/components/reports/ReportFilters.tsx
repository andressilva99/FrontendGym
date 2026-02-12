import { Box, Button, TextField } from "@mui/material";
import React, { useState } from "react";

interface Props {
  onLoad: (year: number, month: number) => void;
}

const ReportFilters: React.FC<Props> = ({ onLoad }) => {
  const [year, setYear] = useState<number | "">("");
  const [month, setMonth] = useState<number | "">("");

  const handleClick = () => {
    if (!year || !month) {
      alert("Ingresá año y mes");
      return;
    }
    onLoad(Number(year), Number(month));
  };

  return (
    <Box sx={{ border: "1px solid #ccc", padding: 2, marginBottom: 3, backgroundColor: "#fafafa" }}>
      <h2>Seleccionar período</h2>
      <TextField
        label="Año"
        type="number"
        value={year}
        onChange={(e) => setYear(e.target.value ? Number(e.target.value) : "")}
        sx={{ marginRight: 2 }}
      />
      <TextField
        label="Mes"
        type="number"
        value={month}
        onChange={(e) => setMonth(e.target.value ? Number(e.target.value) : "")}
        sx={{ marginRight: 2 }}
      />
      <Button variant="contained" onClick={handleClick}>
        Ver resumen
      </Button>
    </Box>
  );
};

export default ReportFilters;