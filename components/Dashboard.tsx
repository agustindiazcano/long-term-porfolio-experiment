"use client";

import { useState } from "react";
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { holdings } from "@/data/holdings";
import { BENCHMARK_COLORS, PALETTE, SECTOR_COLORS } from "@/lib/colors";
import { BENCHMARK_KEYS, PORTFOLIO_KEY, type Row, type Slice } from "@/lib/data";

interface Props {
  valueSeries: Row[];
  indexSeries: Row[];
  benchmarkNames: Record<string, string>;
  byAsset: Slice[];
  bySector: Slice[];
}

type Mode = "value" | "index";
type PieMode = "asset" | "sector";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const tooltipStyle = {
  contentStyle: {
    background: "var(--card-solid)",
    border: "1px solid var(--border)",
    borderRadius: 10,
    color: "var(--fg)",
  },
  itemStyle: { color: "var(--fg)" },
};

export default function Dashboard({
  valueSeries,
  indexSeries,
  benchmarkNames,
  byAsset,
  bySector,
}: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const [benchmarks, setBenchmarks] = useState<string[]>([...BENCHMARK_KEYS]);
  const [mode, setMode] = useState<Mode>("value");
  const [pieMode, setPieMode] = useState<PieMode>("asset");

  const toggle = (list: string[], set: (v: string[]) => void, key: string) =>
    set(list.includes(key) ? list.filter((k) => k !== key) : [...list, key]);

  const assetColor = (ticker: string) =>
    PALETTE[holdings.findIndex((h) => h.ticker === ticker) % PALETTE.length];

  const sliceColor = (key: string) =>
    pieMode === "sector" ? (SECTOR_COLORS[key] ?? "#94a3b8") : assetColor(key);

  const data = mode === "value" ? valueSeries : indexSeries;
  const slices = pieMode === "asset" ? byAsset : bySector;

  const fmt = (v: number) => (mode === "value" ? usd.format(v) : v.toFixed(1));

  return (
    <>
      <section className="card" id="history" aria-labelledby="history-h">
        <div className="card-head">
          <h2 id="history-h">Portfolio vs. S&amp;P 500 vs. Berkshire (USD)</h2>
          <div className="seg" role="group" aria-label="Chart mode">
            <button
              type="button"
              className={mode === "value" ? "on" : ""}
              aria-pressed={mode === "value"}
              onClick={() => setMode("value")}
            >
              Value in US$
            </button>
            <button
              type="button"
              className={mode === "index" ? "on" : ""}
              aria-pressed={mode === "index"}
              onClick={() => setMode("index")}
            >
              Indexed (start = 100)
            </button>
          </div>
        </div>
        <p className="note">
          {mode === "value"
            ? "Portfolio value, and what the same starting capital would be worth in each benchmark. Selected assets show the market value of the position held."
            : "Everything rebased to 100 on the portfolio start date. Selected assets show the stock/commodity price performance."}
        </p>
        <div className="chips">
          <span className="chip fixed">Portfolio</span>
          {BENCHMARK_KEYS.map((k) => (
            <button
              key={k}
              type="button"
              className={`chip ${benchmarks.includes(k) ? "on" : ""}`}
              style={{ ["--c" as string]: BENCHMARK_COLORS[k] }}
              aria-pressed={benchmarks.includes(k)}
              onClick={() => toggle(benchmarks, setBenchmarks, k)}
            >
              {benchmarkNames[k]}
            </button>
          ))}
          <span className="chips-sep" aria-hidden="true" />
          {holdings.map((h) => (
            <button
              key={h.ticker}
              type="button"
              className={`chip ${selected.includes(h.ticker) ? "on" : ""}`}
              style={{ ["--c" as string]: assetColor(h.ticker) }}
              aria-pressed={selected.includes(h.ticker)}
              title={h.name}
              onClick={() => toggle(selected, setSelected, h.ticker)}
            >
              {h.ticker}
            </button>
          ))}
        </div>
        <div className="chart">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--grid)" />
              <XAxis
                dataKey="date"
                minTickGap={56}
                tick={{ fontSize: 12, fill: "var(--muted)" }}
                stroke="var(--grid)"
                tickFormatter={(d: string) => d.slice(0, 4)}
              />
              <YAxis
                width={56}
                tick={{ fontSize: 12, fill: "var(--muted)" }}
                stroke="var(--grid)"
                tickFormatter={(v: number) =>
                  mode === "value" ? `$${Math.round(v / 1000)}k` : String(Math.round(v))
                }
              />
              <Tooltip formatter={(v: number) => fmt(v)} {...tooltipStyle} />
              <Legend wrapperStyle={{ color: "var(--muted)", fontSize: 13 }} />
              <Line
                type="monotone"
                dataKey={PORTFOLIO_KEY}
                name="Portfolio"
                stroke="var(--fg)"
                strokeWidth={3}
                dot={false}
              />
              {benchmarks.map((k) => (
                <Line
                  key={k}
                  type="monotone"
                  dataKey={k}
                  name={benchmarkNames[k]}
                  stroke={BENCHMARK_COLORS[k]}
                  strokeWidth={2}
                  strokeDasharray="6 4"
                  dot={false}
                />
              ))}
              {selected.map((t) => (
                <Line
                  key={t}
                  type="monotone"
                  dataKey={t}
                  stroke={assetColor(t)}
                  strokeWidth={1.75}
                  dot={false}
                  connectNulls={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="card" id="composition" aria-labelledby="composition-h">
        <div className="card-head">
          <h2 id="composition-h">Current portfolio composition</h2>
          <div className="seg" role="group" aria-label="Group composition by">
            <button
              type="button"
              className={pieMode === "asset" ? "on" : ""}
              aria-pressed={pieMode === "asset"}
              onClick={() => setPieMode("asset")}
            >
              By asset
            </button>
            <button
              type="button"
              className={pieMode === "sector" ? "on" : ""}
              aria-pressed={pieMode === "sector"}
              onClick={() => setPieMode("sector")}
            >
              By sector
            </button>
          </div>
        </div>
        <div className="chart pie">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={slices}
                dataKey="pct"
                nameKey="key"
                innerRadius="45%"
                outerRadius="80%"
                paddingAngle={1}
                stroke="var(--card-solid)"
                label={({ key, pct }: { key: string; pct: number }) =>
                  pct >= 3 ? `${key} ${pct.toFixed(1)}%` : ""
                }
                labelLine={false}
              >
                {slices.map((s) => (
                  <Cell key={s.key} fill={sliceColor(s.key)} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v: number, _n: string, item) => [
                  `${v.toFixed(1)}% · ${usd.format((item.payload as Slice).value)}`,
                  (item.payload as Slice).name,
                ]}
                {...tooltipStyle}
              />
              <Legend wrapperStyle={{ color: "var(--muted)", fontSize: 13 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <p className="note">
          Share of the current market value of the positions (CFDs at notional value).
        </p>
      </section>
    </>
  );
}
