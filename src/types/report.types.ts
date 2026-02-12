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