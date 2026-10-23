// Positions of the analyzed public portfolio (real names).
// NOTE: `weight` (initial weight) and `drift`/`vol` are PLACEHOLDERS until the real
// 2016 transactions are loaded: they only generate the illustrative series in lib/data.ts.
// `weight` is relative; lib/data.ts normalizes it so it sums to 1.
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
  { ticker: "XAU", name: "Gold", sector: "Commodities", weight: 1, drift: 0.007, vol: 0.035 },
  { ticker: "WTI", name: "Crude Oil", sector: "Commodities", weight: 1, drift: 0.005, vol: 0.08 },
  { ticker: "JPM", name: "JP Morgan Chase", sector: "Financials", weight: 1, drift: 0.011, vol: 0.05 },
  { ticker: "META", name: "Facebook (Meta)", sector: "Technology", weight: 1, drift: 0.014, vol: 0.07 },
  { ticker: "BABA", name: "Alibaba", sector: "Technology", weight: 1, drift: 0.004, vol: 0.08 },
  { ticker: "FSLR", name: "First Solar", sector: "Energy", weight: 1, drift: 0.012, vol: 0.1 },
  { ticker: "TSLA", name: "Tesla Motors", sector: "Automotive", weight: 1, drift: 0.03, vol: 0.14 },
  { ticker: "GOOGL", name: "Google (Alphabet)", sector: "Technology", weight: 1, drift: 0.014, vol: 0.055 },
  { ticker: "SBUX", name: "Starbucks", sector: "Consumer", weight: 1, drift: 0.009, vol: 0.055 },
  { ticker: "XAG", name: "Silver", sector: "Commodities", weight: 1, drift: 0.008, vol: 0.06 },
  { ticker: "AMZN", name: "Amazon.com", sector: "Technology", weight: 1, drift: 0.015, vol: 0.06 },
  { ticker: "AAPL", name: "Apple", sector: "Technology", weight: 1, drift: 0.016, vol: 0.055 },
  { ticker: "NLOK", name: "NortonLifeLock (Symantec)", sector: "Technology", weight: 1, drift: 0.006, vol: 0.07 },
  { ticker: "VRTX", name: "Vertex Pharmaceuticals", sector: "Healthcare", weight: 1, drift: 0.015, vol: 0.06 },
  { ticker: "NG", name: "Natural Gas (commodity)", sector: "Commodities", weight: 1, drift: 0.002, vol: 0.11 },
];

// Account status (values in pounds, taken from the public portfolio).
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
