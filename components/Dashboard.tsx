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
import { PALETTE } from "@/lib/colors";
import { PORTFOLIO_KEY, type Row } from "@/lib/data";

interface Props {
  series: Row[];
  composition: { ticker: string; name: string; sector: string; pct: number }[];
}

export default function Dashboard({ series, composition }: Props) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (ticker: string) =>
    setSelected((s) => (s.includes(ticker) ? s.filter((t) => t !== ticker) : [...s, ticker]));

  const colorOf = (ticker: string) =>
    PALETTE[holdings.findIndex((h) => h.ticker === ticker) % PALETTE.length];

  return (
    <>
      <section className="card">
        <h2>Historical performance (base 100 = March 2016)</h2>
        <div className="chips">
          <span className="chip fixed">Total portfolio</span>
          {holdings.map((h) => (
            <button
              key={h.ticker}
              type="button"
              className={`chip ${selected.includes(h.ticker) ? "on" : ""}`}
              style={{ ["--c" as string]: colorOf(h.ticker) }}
              aria-pressed={selected.includes(h.ticker)}
              onClick={() => toggle(h.ticker)}
            >
              {h.ticker}
            </button>
          ))}
        </div>
        <div className="chart">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={series} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--grid)" />
              <XAxis dataKey="date" minTickGap={48} tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} width={44} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--fg)" }} />
              <Legend />
              <Line
                type="monotone"
                dataKey={PORTFOLIO_KEY}
                name="Portfolio"
                stroke="var(--fg)"
                strokeWidth={3}
                dot={false}
              />
              {selected.map((t) => (
                <Line
                  key={t}
                  type="monotone"
                  dataKey={t}
                  stroke={colorOf(t)}
                  strokeWidth={1.75}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="card">
        <h2>Current portfolio composition</h2>
        <div className="chart pie">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={composition}
                dataKey="pct"
                nameKey="ticker"
                innerRadius="45%"
                outerRadius="80%"
                paddingAngle={1}
                label={({ ticker, pct }) => `${ticker} ${pct.toFixed(1)}%`}
                labelLine={false}
              >
                {composition.map((c) => (
                  <Cell key={c.ticker} fill={colorOf(c.ticker)} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => `${v.toFixed(1)}%`} contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--fg)" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>
    </>
  );
}
