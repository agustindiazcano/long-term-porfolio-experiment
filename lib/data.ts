import { holdings, START_DATE } from "@/data/holdings";

export const PORTFOLIO_KEY = "PORTFOLIO";

export type Row = { date: string } & Record<string, number | string>;

const totalWeight = holdings.reduce((a, h) => a + h.weight, 0);

// PRNG determinista para que la serie ilustrativa sea estable entre builds.
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function monthsBetween(start: string, end: Date): string[] {
  const [y, m] = start.split("-").map(Number);
  const out: string[] = [];
  let year = y;
  let month = m;
  while (year < end.getFullYear() || (year === end.getFullYear() && month <= end.getMonth() + 1)) {
    out.push(`${year}-${String(month).padStart(2, "0")}`);
    month++;
    if (month > 12) {
      month = 1;
      year++;
    }
  }
  return out;
}

/** Serie mensual en base 100 por activo + el portfolio (buy & hold, sin rebalanceo). */
export function buildSeries(): Row[] {
  const dates = monthsBetween(START_DATE, new Date());
  const levels = holdings.map(() => 100);
  const rngs = holdings.map((_, i) => mulberry32(1000 + i * 77));

  return dates.map((date, idx) => {
    const row: Row = { date };
    holdings.forEach((h, i) => {
      if (idx > 0) {
        const shock = (rngs[i]() - 0.5) * 2 * h.vol;
        levels[i] *= 1 + h.drift + shock;
      }
      row[h.ticker] = Number(levels[i].toFixed(2));
    });
    row[PORTFOLIO_KEY] = Number(
      holdings.reduce((acc, h, i) => acc + (h.weight / totalWeight) * levels[i], 0).toFixed(2),
    );
    return row;
  });
}

/** Composicion actual: el peso inicial arrastrado por la performance de cada posicion. */
export function currentComposition(series: Row[]) {
  const last = series[series.length - 1];
  const values = holdings.map((h) => ({
    ticker: h.ticker,
    name: h.name,
    sector: h.sector,
    value: (h.weight / totalWeight) * (last[h.ticker] as number),
  }));
  const total = values.reduce((a, v) => a + v.value, 0);
  return values.map((v) => ({ ...v, pct: (v.value / total) * 100 }));
}
