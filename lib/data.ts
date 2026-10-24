import portfolioJson from "@/data/generated/portfolio.json";

export const PORTFOLIO_KEY = "PORTFOLIO";
export const BENCHMARK_KEYS = ["SP500", "BRK"] as const;

export type Row = { date: string } & Record<string, number | null | string>;

export interface Slice {
  key: string;
  name: string;
  value: number;
  pct: number;
}

interface Generated {
  meta: {
    generatedAt: string;
    asOf: string;
    startDate: string;
    gbpUsdNow: number;
    gbpUsdStart: number;
    initialCapitalUsd: number;
    modelValueUsd: number;
    benchmarks: Record<(typeof BENCHMARK_KEYS)[number], string>;
  };
  valueSeries: Row[];
  indexSeries: Row[];
  composition: { ticker: string; name: string; sector: string; value: number }[];
}

export const portfolio = portfolioJson as unknown as Generated;

function toSlices(items: { key: string; name: string; value: number }[]): Slice[] {
  const total = items.reduce((a, i) => a + i.value, 0);
  return items
    .filter((i) => i.value > 0)
    .map((i) => ({ ...i, pct: (i.value / total) * 100 }))
    .sort((a, b) => b.pct - a.pct);
}

export function compositionByAsset(): Slice[] {
  return toSlices(
    portfolio.composition.map((c) => ({ key: c.ticker, name: c.name, value: c.value })),
  );
}

export function compositionBySector(): Slice[] {
  const bySector = new Map<string, number>();
  for (const c of portfolio.composition) {
    bySector.set(c.sector, (bySector.get(c.sector) ?? 0) + c.value);
  }
  return toSlices([...bySector].map(([sector, value]) => ({ key: sector, name: sector, value })));
}

/** Final value of a series divided by its starting value (index series start at 100). */
export function multipleOf(key: string): number {
  const last = portfolio.indexSeries[portfolio.indexSeries.length - 1];
  return (last[key] as number) / 100;
}
