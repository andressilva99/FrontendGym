import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import React, { useMemo } from "react";
import type { GeneralSummary, TrainerSummary } from "../../types/report.types";
import { formatMoney } from "../../utils/padel.utils";
import { percent, toPieSlices } from "../../utils/chart.utils";

interface Props {
  data: TrainerSummary[];
  general: GeneralSummary | null;
}

// El back arma el nombre como "usuario (DNI: 123)": separamos para mostrarlo más limpio
const splitTrainerName = (full: string) => {
  const match = /^(.*?)\s*\(DNI:\s*([^)]*)\)\s*$/.exec(full);
  // El nombre se muestra en mayúscula (tabla y gráfico), igual que en el resto de las tablas
  return match
    ? { name: match[1].toLocaleUpperCase("es-AR"), dni: match[2] }
    : { name: full.toLocaleUpperCase("es-AR"), dni: "" };
};

interface Row {
  id: string;
  name: string;
  dni: string;
  socios: number;
  expected: number;
  collected: number;
  paid: number;
}

// Gráfico de dona con lo cobrado por entrenador + tabla con el detalle (la tabla es la leyenda)
const TrainerSummaryTable: React.FC<Props> = ({ data, general }) => {
  const rows = useMemo<Row[]>(() => {
    const list: Row[] = data.map((t) => ({
      id: t.trainerId,
      ...splitTrainerName(t.trainerName),
      socios: t.totalSocios,
      expected: t.expectedTotal,
      collected: t.collectedTotal,
      paid: t.paidCount,
    }));

    // Cuotas de socios sin entrenador asignado: el back no las agrupa, las calculamos por diferencia
    if (general) {
      const sum = (key: keyof Row) => list.reduce((acc, r) => acc + (r[key] as number), 0);
      const orphan: Row = {
        id: "sin-entrenador",
        name: "Sin entrenador",
        dni: "",
        socios: general.totalSocios - sum("socios"),
        expected: general.expectedTotal - sum("expected"),
        collected: general.collectedTotal - sum("collected"),
        paid: general.paidCount - sum("paid"),
      };
      if (orphan.socios > 0) list.push(orphan);
    }
    return list;
  }, [data, general]);

  const slices = useMemo(
    () => toPieSlices(rows.map((r) => ({ id: r.id, label: r.name, value: r.collected }))),
    [rows]
  );
  const colorById = new Map(slices.map((s) => [s.id, s.color]));
  const totalCollected = rows.reduce((acc, r) => acc + r.collected, 0);

  if (!rows.length) {
    return (
      <Typography sx={{ color: "#6b7280", py: 3, textAlign: "center" }}>
        No hay cuotas generadas para este mes.
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", lg: "minmax(280px, 360px) 1fr" },
        gap: 3,
        alignItems: "center",
      }}
    >
      {/* ===== DONA: COBRADO POR ENTRENADOR ===== */}
      <Box sx={{ position: "relative", height: 280 }}>
        {totalCollected > 0 ? (
          <>
            <PieChart
              height={280}
              hideLegend
              series={[
                {
                  data: slices,
                  innerRadius: 78,
                  outerRadius: 120,
                  paddingAngle: 1.5,
                  cornerRadius: 4,
                  highlightScope: { fade: "global", highlight: "item" },
                  valueFormatter: (item) => `${formatMoney(item.value)} (${percent(item.value, totalCollected)}%)`,
                },
              ]}
            />
            {/* Total en el centro de la dona */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none",
              }}
            >
              <Typography sx={{ fontSize: 12, color: "#6b7280", fontWeight: 600 }}>Cobrado</Typography>
              <Typography sx={{ fontSize: 20, fontWeight: 900, color: "#111827", fontVariantNumeric: "tabular-nums" }}>
                {formatMoney(totalCollected)}
              </Typography>
            </Box>
          </>
        ) : (
          <Box sx={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Typography sx={{ color: "#6b7280", textAlign: "center" }}>
              Todavía no hay cuotas cobradas este mes.
            </Typography>
          </Box>
        )}
      </Box>

      {/* ===== TABLA (LEYENDA DEL GRÁFICO) ===== */}
      <TableContainer sx={{ border: "1px solid rgba(0,0,0,0.06)", borderRadius: 3 }}>
        <Table size="small">
          <TableHead sx={{ bgcolor: "#f9fafb" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Entrenador</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>Socios</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>Esperado</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>Cobrado</TableCell>
              <TableCell sx={{ fontWeight: 700, minWidth: 140 }}>% cobrado</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((r) => {
              const pct = percent(r.collected, r.expected);
              const color = colorById.get(r.id) ?? "#9ca3af";
              return (
                <TableRow key={r.id} hover>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                      <Box sx={{ width: 12, height: 12, borderRadius: "3px", bgcolor: color, flexShrink: 0 }} />
                      <Box>
                        <Typography sx={{ fontWeight: 700, fontSize: 14 }}>{r.name}</Typography>
                        {r.dni && <Typography sx={{ fontSize: 12, color: "#6b7280" }}>DNI {r.dni}</Typography>}
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell align="right" sx={{ fontVariantNumeric: "tabular-nums" }}>
                    {r.paid}/{r.socios}
                  </TableCell>
                  <TableCell align="right" sx={{ fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
                    {formatMoney(r.expected)}
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
                    {formatMoney(r.collected)}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box sx={{ flex: 1, height: 6, borderRadius: 3, bgcolor: "#e5e7eb", overflow: "hidden" }}>
                        <Box sx={{ width: `${Math.min(pct, 100)}%`, height: "100%", bgcolor: "#2a78d6", borderRadius: 3 }} />
                      </Box>
                      <Typography sx={{ fontSize: 13, fontWeight: 700, width: 38, textAlign: "right" }}>{pct}%</Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TrainerSummaryTable;
