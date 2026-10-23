// Posiciones del portfolio público analizado (nombres reales).
// OJO: `weight` (peso inicial) y `drift`/`vol` son PLACEHOLDERS hasta cargar las
// transacciones reales de 2016: se usan para generar la serie ilustrativa en lib/data.ts.
// `weight` es relativo; lib/data.ts lo normaliza para que sume 1.
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
  { ticker: "XAU", name: "Oro", sector: "Commodities", weight: 1, drift: 0.007, vol: 0.035 },
  { ticker: "WTI", name: "Petróleo Crudo", sector: "Commodities", weight: 1, drift: 0.005, vol: 0.08 },
  { ticker: "JPM", name: "JP Morgan Chase", sector: "Finanzas", weight: 1, drift: 0.011, vol: 0.05 },
  { ticker: "META", name: "Facebook (Meta)", sector: "Tecnología", weight: 1, drift: 0.014, vol: 0.07 },
  { ticker: "BABA", name: "Alibaba", sector: "Tecnología", weight: 1, drift: 0.004, vol: 0.08 },
  { ticker: "FSLR", name: "First Solar", sector: "Energía", weight: 1, drift: 0.012, vol: 0.1 },
  { ticker: "TSLA", name: "Tesla Motors", sector: "Automotriz", weight: 1, drift: 0.03, vol: 0.14 },
  { ticker: "GOOGL", name: "Google (Alphabet)", sector: "Tecnología", weight: 1, drift: 0.014, vol: 0.055 },
  { ticker: "SBUX", name: "Starbucks", sector: "Consumo", weight: 1, drift: 0.009, vol: 0.055 },
  { ticker: "XAG", name: "Plata", sector: "Commodities", weight: 1, drift: 0.008, vol: 0.06 },
  { ticker: "AMZN", name: "Amazon.com", sector: "Tecnología", weight: 1, drift: 0.015, vol: 0.06 },
  { ticker: "AAPL", name: "Apple", sector: "Tecnología", weight: 1, drift: 0.016, vol: 0.055 },
  { ticker: "NLOK", name: "NortonLifeLock (Symantec)", sector: "Tecnología", weight: 1, drift: 0.006, vol: 0.07 },
  { ticker: "VRTX", name: "Vertex Pharmaceuticals", sector: "Salud", weight: 1, drift: 0.015, vol: 0.06 },
  { ticker: "NG", name: "Gas natural (commodity)", sector: "Commodities", weight: 1, drift: 0.002, vol: 0.11 },
];

// Estado de la cuenta (valores en libras, tomados del portfolio público).
export const ACCOUNT = {
  currency: "GBP",
  asOf: "2026-10",
  initialCapital: 100000,
  accountValue: 603875.93,
  availableCapital: 42363.51,
  balance: 48731.61,
  marginUsed: 6368.09,
  commissionsPaid: 422.18,
  investedCapital: 555144.32,
};
