// Un período es un mes de cuota en formato "YYYY-MM" (se compara bien como texto)
export interface PeriodRange {
  from: string;
  to: string;
}

export const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export const toPeriod = (year: number, month: number) => `${year}-${String(month).padStart(2, "0")}`;

// Mes actual + offset (ej: -1 = mes anterior)
export const periodFromToday = (offset = 0) => {
  const d = new Date();
  const date = new Date(d.getFullYear(), d.getMonth() + offset, 1);
  return toPeriod(date.getFullYear(), date.getMonth() + 1);
};

// Vista por defecto de pagos: el mes anterior y el actual
export const defaultPeriodRange = (): PeriodRange => ({ from: periodFromToday(-1), to: periodFromToday(0) });

export const formatPeriod = (period: string) => {
  const [year, month] = period.split("-").map(Number);
  return `${MONTH_NAMES[month - 1]} ${year}`;
};
