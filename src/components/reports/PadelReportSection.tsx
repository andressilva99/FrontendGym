import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import PaidIcon from "@mui/icons-material/Paid";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import SportsTennisIcon from "@mui/icons-material/SportsTennis";
import { useMemo } from "react";
import type { PadelReport } from "../../types/report.types";
import StatTile from "./StatTile";
import { formatMoney } from "../../utils/padel.utils";
import { CHART_PRIMARY, percent, toPieSlices } from "../../utils/chart.utils";

interface Props {
  data: PadelReport | null;
}

const cardSx = {
  p: { xs: 2, sm: 2.5 },
  borderRadius: 3,
  border: "1px solid rgba(0,0,0,0.06)",
  bgcolor: "#fff",
};

const SectionTitle = ({ children, subtitle }: { children: React.ReactNode; subtitle?: string }) => (
  <Box sx={{ mb: 1.5 }}>
    <Typography sx={{ fontWeight: 800, color: "#111827", fontSize: 16 }}>{children}</Typography>
    {subtitle && <Typography sx={{ fontSize: 13, color: "#6b7280" }}>{subtitle}</Typography>}
  </Box>
);

export default function PadelReportSection({ data }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const courtSlices = useMemo(
    () => toPieSlices((data?.byCourt ?? []).map((c) => ({ id: c.courtName, label: c.courtName, value: c.revenue }))),
    [data]
  );

  if (!data) return null;

  const { totals } = data;

  if (totals.bookings === 0) {
    return (
      <Box sx={{ ...cardSx, textAlign: "center", py: 6 }}>
        <SportsTennisIcon sx={{ fontSize: 48, color: "rgba(24,119,242,0.35)" }} />
        <Typography sx={{ fontWeight: 700, mt: 1 }}>No hubo turnos reservados en este mes</Typography>
        <Typography sx={{ fontSize: 14, color: "#6b7280" }}>
          {totals.slotsTotal > 0 ? `Se ofrecieron ${totals.slotsTotal} turnos.` : "No se cargaron turnos para este mes."}
        </Typography>
      </Box>
    );
  }

  const busiestDay = data.byDay.reduce((best, d) => (d.bookings > best.bookings ? d : best), data.byDay[0]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* ===== INDICADORES ===== */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        <StatTile
          label="Turnos reservados"
          value={String(totals.bookings)}
          hint={busiestDay.bookings > 0 ? `Día con más reservas: el ${busiestDay.day} (${busiestDay.bookings})` : undefined}
          icon={<EventAvailableIcon fontSize="small" />}
        />
        <StatTile
          label="Ingresos por turnos"
          value={formatMoney(totals.revenue)}
          hint="Suma de los montos de las reservas del mes"
          icon={<PaidIcon fontSize="small" />}
        />
        <StatTile
          label="Ticket promedio"
          value={formatMoney(totals.averageTicket)}
          hint="Monto promedio por turno"
          icon={<ConfirmationNumberIcon fontSize="small" />}
        />
        <StatTile
          label="Ocupación"
          value={`${totals.occupancy}%`}
          hint={`${totals.slotsBooked} de ${totals.slotsTotal} turnos ofrecidos`}
          progress={totals.occupancy}
          icon={<SportsTennisIcon fontSize="small" />}
        />
      </Box>

      {/* ===== RESERVAS POR DÍA ===== */}
      <Box sx={cardSx}>
        <SectionTitle
          subtitle={
            isMobile
              ? "Turnos reservados por día. Tocá una barra para ver el detalle."
              : "Cantidad de turnos reservados en cada día del mes"
          }
        >
          Reservas por día
        </SectionTitle>
        {/* El gráfico ocupa el ancho disponible (sin scroll lateral: en celular el gráfico no deja
            deslizar de costado). En celular se muestran menos números en el eje para que entren. */}
        <Box sx={{ width: "100%" }}>
            <BarChart
              height={isMobile ? 220 : 260}
              hideLegend
              borderRadius={isMobile ? 2 : 4}
              grid={{ horizontal: true }}
              margin={isMobile ? { left: 0, right: 4 } : undefined}
              xAxis={[
                {
                  scaleType: "band",
                  data: data.byDay.map((d) => d.day),
                  label: isMobile ? undefined : "Día del mes",
                  categoryGapRatio: isMobile ? 0.2 : 0.35,
                  // En celular: solo 1, 5, 10, 15, 20, 25, 30 para que los números no se pisen
                  tickLabelInterval: isMobile ? (day: number) => day === 1 || day % 5 === 0 : "auto",
                },
              ]}
              yAxis={[{ tickMinStep: 1, width: 36 }]}
              series={[
                {
                  data: data.byDay.map((d) => d.bookings),
                  label: "Turnos",
                  color: CHART_PRIMARY,
                  valueFormatter: (value, { dataIndex }) => {
                    const day = data.byDay[dataIndex];
                    return `${value ?? 0} ${value === 1 ? "turno" : "turnos"} · ${formatMoney(day?.revenue)}`;
                  },
                },
              ]}
              sx={{
                "& .MuiChartsGrid-line": { stroke: "#eef0f3" },
                "& .MuiChartsAxis-line, & .MuiChartsAxis-tick": { stroke: "#d1d5db" },
              }}
            />
        </Box>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" }, gap: 3 }}>
        {/* ===== INGRESOS POR CANCHA ===== */}
        <Box sx={cardSx}>
          <SectionTitle subtitle="Cómo se reparten los ingresos entre las canchas">Ingresos por cancha</SectionTitle>
          {courtSlices.length > 1 ? (
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "220px 1fr" }, gap: 2, alignItems: "center" }}>
              <PieChart
                height={220}
                hideLegend
                series={[
                  {
                    data: courtSlices,
                    innerRadius: 58,
                    outerRadius: 95,
                    paddingAngle: 1.5,
                    cornerRadius: 4,
                    highlightScope: { fade: "global", highlight: "item" },
                    valueFormatter: (item) => `${formatMoney(item.value)} (${percent(item.value, totals.revenue)}%)`,
                  },
                ]}
              />
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
                {courtSlices.map((s) => {
                  const court = data.byCourt.find((c) => c.courtName === s.id);
                  return (
                    <Box key={s.id} sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                      <Box sx={{ width: 12, height: 12, borderRadius: "3px", bgcolor: s.color, flexShrink: 0 }} />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography sx={{ fontWeight: 700, fontSize: 14 }} noWrap>
                          {s.label}
                        </Typography>
                        <Typography sx={{ fontSize: 12, color: "#6b7280" }}>
                          {court ? `${court.bookings} turnos · ` : ""}
                          {formatMoney(s.value)} ({percent(s.value, totals.revenue)}%)
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          ) : (
            <Box sx={{ py: 2 }}>
              <Typography sx={{ fontWeight: 700 }}>{data.byCourt[0]?.courtName}</Typography>
              <Typography sx={{ fontSize: 14, color: "#6b7280" }}>
                Todos los ingresos del mes corresponden a esta cancha: {data.byCourt[0]?.bookings} turnos ·{" "}
                {formatMoney(data.byCourt[0]?.revenue)}
              </Typography>
            </Box>
          )}
        </Box>

        {/* ===== DETALLE POR TARIFA ===== */}
        <Box sx={cardSx}>
          <SectionTitle subtitle="Turnos reservados agrupados por el valor del turno">Detalle por tarifa</SectionTitle>
          <TableContainer sx={{ border: "1px solid rgba(0,0,0,0.06)", borderRadius: 2 }}>
            <Table size="small">
              <TableHead sx={{ bgcolor: "#f9fafb" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Tarifa</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>Turnos</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>Total</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>% ingresos</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.byRate.map((r) => (
                  <TableRow key={r.amount} hover>
                    <TableCell sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>{formatMoney(r.amount)}</TableCell>
                    <TableCell align="right" sx={{ fontVariantNumeric: "tabular-nums" }}>{r.bookings}</TableCell>
                    <TableCell align="right" sx={{ fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
                      {formatMoney(r.revenue)}
                    </TableCell>
                    <TableCell align="right" sx={{ fontVariantNumeric: "tabular-nums" }}>
                      {percent(r.revenue, totals.revenue)}%
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow sx={{ bgcolor: "#f9fafb" }}>
                  <TableCell sx={{ fontWeight: 800 }}>Total</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 800 }}>{totals.bookings}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 800, whiteSpace: "nowrap" }}>{formatMoney(totals.revenue)}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 800 }}>100%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
}
