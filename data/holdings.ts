// DATOS DE EJEMPLO: reemplazar por las posiciones reales del experimento.
// `weight` es el peso inicial (marzo 2016) y la suma debe ser 1.
// `drift` y `vol` solo se usan para generar la serie de ejemplo en lib/data.ts.
export interface Holding {
  ticker: string;
  name: string;
  sector: string;
  weight: number;
  drift: number;
  vol: number;
}

export const START_DATE = "2016-03";

export const holdings: Holding[] = [
  { ticker: "AAA", name: "Empresa A", sector: "Tecnología", weight: 0.25, drift: 0.014, vol: 0.06 },
  { ticker: "BBB", name: "Empresa B", sector: "Finanzas", weight: 0.2, drift: 0.008, vol: 0.05 },
  { ticker: "CCC", name: "Empresa C", sector: "Consumo", weight: 0.2, drift: 0.01, vol: 0.045 },
  { ticker: "DDD", name: "Empresa D", sector: "Energía", weight: 0.15, drift: 0.005, vol: 0.08 },
  { ticker: "EEE", name: "Empresa E", sector: "Salud", weight: 0.1, drift: 0.011, vol: 0.05 },
  { ticker: "FFF", name: "Empresa F", sector: "Industria", weight: 0.1, drift: 0.007, vol: 0.055 },
];
