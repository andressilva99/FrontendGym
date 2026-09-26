/*
 * Paleta categórica para gráficos, validada para daltonismo sobre fondo blanco.
 * Se asigna SIEMPRE en este orden (nunca salteada ni generada): el 1° elemento azul,
 * el 2° naranja, etc. Para magnitudes de una sola serie (ej: barras por día) usar CHART_PRIMARY.
 */
export const CHART_COLORS = [
  "#2a78d6", // azul
  "#eb6834", // naranja
  "#1baf7a", // aqua
  "#eda100", // amarillo
  "#e87ba4", // magenta
  "#008300", // verde
  "#4a3aa7", // violeta
  "#e34948", // rojo
];

export const CHART_PRIMARY = CHART_COLORS[0];
export const CHART_OTHERS = "#9ca3af"; // gris para "Otros"

// Máximo de porciones de una torta: el resto se agrupa en "Otros" para que se pueda leer
export const MAX_PIE_SLICES = 6;

export interface PieSlice {
  id: string;
  label: string;
  value: number;
  color: string;
}

// Ordena de mayor a menor, asigna colores en orden y agrupa lo que sobra en "Otros"
export const toPieSlices = (items: { id: string; label: string; value: number }[]): PieSlice[] => {
  const sorted = items.filter((i) => i.value > 0).sort((a, b) => b.value - a.value);
  const top = sorted.slice(0, MAX_PIE_SLICES - (sorted.length > MAX_PIE_SLICES ? 1 : 0));
  const rest = sorted.slice(top.length);

  const slices = top.map((item, i) => ({ ...item, color: CHART_COLORS[i] }));
  if (rest.length > 0) {
    slices.push({
      id: "otros",
      label: `Otros (${rest.length})`,
      value: rest.reduce((acc, i) => acc + i.value, 0),
      color: CHART_OTHERS,
    });
  }
  return slices;
};

export const percent = (part: number, total: number) => (total > 0 ? Math.round((part / total) * 100) : 0);
