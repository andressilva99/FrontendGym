import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import React from "react";
import type { TrainerSummary } from "../../types/report.types";

interface Props {
  data: TrainerSummary[];
}

const TrainerSummaryTable: React.FC<Props> = ({ data }) => {
  if (!data.length) return null;

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Entrenador</TableCell>
            <TableCell>Socios</TableCell>
            <TableCell>Total esperado</TableCell>
            <TableCell>Total cobrado</TableCell>
            <TableCell>Pagos realizados</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((t) => (
            <TableRow key={t.trainerId}>
              <TableCell>{t.trainerName}</TableCell>
              <TableCell>{t.totalSocios}</TableCell>
              <TableCell>$ {t.expectedTotal}</TableCell>
              <TableCell>$ {t.collectedTotal}</TableCell>
              <TableCell>{t.paidCount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TrainerSummaryTable;