import { api } from "./axios";
import type { PadelReport, ReportResponse } from "../types/report.types";

// Resumen de cuotas del mes (general + por entrenador)
export const getSummaryReport = async (year: number, month: number): Promise<ReportResponse> => {
  const { data } = await api.get<ReportResponse>("/reports/summary", { params: { year, month } });
  return data;
};

// Turnos de padel del mes (por fecha del turno)
export const getPadelReport = async (year: number, month: number): Promise<PadelReport> => {
  const { data } = await api.get<PadelReport>("/reports/padel", { params: { year, month } });
  return data;
};
