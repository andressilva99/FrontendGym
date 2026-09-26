export interface Share {
  _id: string;
  numberDays: number;
  amount: number;
  quoteDate: Date;
  active?: boolean; // las cuotas viejas no lo tienen: se consideran activas
}