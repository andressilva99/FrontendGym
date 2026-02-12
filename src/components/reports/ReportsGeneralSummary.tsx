import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import React from "react";
import type { GeneralSummary } from "../../types/report.types";

interface Props {
  data: GeneralSummary | null;
}

const GeneralSummaryTable: React.FC<Props> = ({ data }) => {
  if (!data) return null;

  return (
    <TableContainer component={Paper} sx={{ marginBottom: 3 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Total socios</TableCell>
            <TableCell>Total esperado</TableCell>
            <TableCell>Total cobrado</TableCell>
            <TableCell>Pagos realizados</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>{data.totalSocios}</TableCell>
            <TableCell>$ {data.expectedTotal}</TableCell>
            <TableCell>$ {data.collectedTotal}</TableCell>
            <TableCell>{data.paidCount}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default GeneralSummaryTable;