import React, { useState } from "react";
import ReportFilters from "../components/reports/ReportFilters";
import GeneralSummaryTable from "../components/reports/ReportsGeneralSummary";
import TrainerSummaryTable from "../components/reports/ReportTrainerSummary";
import type { GeneralSummary, TrainerSummary, ReportResponse } from "../types/report.types";
import { api } from "../api/axios";
const ReportsPage: React.FC = () => {
  const [general, setGeneral] = useState<GeneralSummary | null>(null);
  const [byTrainer, setByTrainer] = useState<TrainerSummary[]>([]);

  const loadReport = async (year: number, month: number) => {
    try {
      const res = await api.get<ReportResponse>("/reports/summary", {
        params: { year, month },
      });

      setGeneral(res.data.general);
      setByTrainer(res.data.byTrainer);
    } catch (err) {
      console.error(err);
      alert("Error cargando el reporte");
    }
  };

  return (
    <div>
      <h1>Resumen de Pagos</h1>
      <ReportFilters onLoad={loadReport} />
      <GeneralSummaryTable data={general} />
      <TrainerSummaryTable data={byTrainer} />
    </div>
  );
};

export default ReportsPage;