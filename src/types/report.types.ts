export interface GeneralSummary {
  year: number;
  month: number;
  totalSocios: number;
  expectedTotal: number;
  paidCount: number;
  collectedTotal: number;
}

export interface TrainerSummary {
  trainerId: string;
  trainerName: string;
  totalSocios: number;
  expectedTotal: number;
  paidCount: number;
  collectedTotal: number;
}

export interface ReportResponse {
  general: GeneralSummary;
  byTrainer: TrainerSummary[];
}
/* ===== Reporte mensual de padel ===== */

export interface PadelReportTotals {
  bookings: number;
  revenue: number;
  averageTicket: number;
  slotsTotal: number; // turnos ofrecidos en el mes
  slotsBooked: number;
  occupancy: number; // % de turnos ofrecidos que se reservaron
}

export interface PadelReportByCourt {
  courtName: string;
  bookings: number;
  revenue: number;
}

export interface PadelReportByRate {
  amount: number; // tarifa (monto del turno)
  bookings: number;
  revenue: number;
}

export interface PadelReportByDay {
  day: number;
  bookings: number;
  revenue: number;
}

export interface PadelReport {
  year: number;
  month: number;
  totals: PadelReportTotals;
  byCourt: PadelReportByCourt[];
  byRate: PadelReportByRate[];
  byDay: PadelReportByDay[];
}
