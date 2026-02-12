export interface Trainer {
  _id: string;
  username: string;
}

export interface Socio {
  _id: string;
  apellido: string;
  nombre: string;
  trainerId: Trainer;
}

export interface Share {
  _id: string;
  amount: number;
  numberDays: number;
  quoteDate: string;
}

export interface Payment {
  _id: string;
  socioId: Socio;
  shareId: Share;
  year: number;
  month: number;
  isPaid: boolean;
  paymentDate: string | null;
}

export interface GeneratePaymentDto {
  year: number;
  month: number;
  shareId: string;
  socioIds: string[];
}