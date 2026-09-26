import { Box } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import PaidIcon from "@mui/icons-material/Paid";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import React from "react";
import type { GeneralSummary } from "../../types/report.types";
import StatTile from "./StatTile";
import { formatMoney } from "../../utils/padel.utils";
import { percent } from "../../utils/chart.utils";

interface Props {
  data: GeneralSummary | null;
}

// Fila de indicadores del mes: cuotas generadas, esperado, cobrado (con % cobrado) y pendiente
const GeneralSummaryTable: React.FC<Props> = ({ data }) => {
  if (!data) return null;

  const collectedPct = percent(data.collectedTotal, data.expectedTotal);
  const pending = Math.max(data.expectedTotal - data.collectedTotal, 0);
  const unpaidCount = data.totalSocios - data.paidCount;

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
      <StatTile
        label="Cuotas del mes"
        value={String(data.totalSocios)}
        hint={`${data.paidCount} pagadas · ${unpaidCount} pendientes`}
        icon={<PeopleIcon fontSize="small" />}
      />
      <StatTile
        label="Total esperado"
        value={formatMoney(data.expectedTotal)}
        hint="Suma de todas las cuotas del mes"
        icon={<RequestQuoteIcon fontSize="small" />}
      />
      <StatTile
        label="Total cobrado"
        value={formatMoney(data.collectedTotal)}
        hint={`${collectedPct}% de lo esperado`}
        progress={collectedPct}
        icon={<PaidIcon fontSize="small" />}
      />
      <StatTile
        label="Pendiente de cobro"
        value={formatMoney(pending)}
        hint={`${unpaidCount} ${unpaidCount === 1 ? "cuota" : "cuotas"} sin pagar`}
        icon={<PendingActionsIcon fontSize="small" />}
      />
    </Box>
  );
};

export default GeneralSummaryTable;
