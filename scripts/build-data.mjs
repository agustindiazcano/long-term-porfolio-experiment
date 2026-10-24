// Do not run directly: use scripts/update-data.mjs, which falls back to the committed snapshot on failure.
// Rebuilds data/generated/portfolio.json from the real transactions
// (data/transactions.json) and market data from Yahoo Finance. Everything is in USD.
import { mkdir, readFile, writeFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const readJson = async (p) => JSON.parse(await readFile(new URL(p, root), "utf8"));

const holdings = await readJson("data/holdings.json");
const transactions = await readJson("data/transactions.json");
const account = await readJson("data/account.json");
const benchmarkDefs = await readJson("data/benchmarks.json");
const START = account.startDate;
const CHART_FROM = "2016-01-01";

// ---------- Yahoo Finance ----------
async function fetchSeries(symbol, adjusted = false, attempts = 3) {
  const p1 = Math.floor(Date.UTC(2015, 11, 1) / 1000);
  const p2 = Math.floor(Date.now() / 1000) + 86400;
  const url = `${process.env.YAHOO_BASE ?? "https://query1.finance.yahoo.com"}/v8/finance/chart/${encodeURIComponent(
    symbol,
  )}?period1=${p1}&period2=${p2}&interval=1d&events=split`;
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const r = json.chart?.result?.[0];
      if (!r?.timestamp) throw new Error("no data");
      const off = r.meta.gmtoffset ?? 0;
      const close = new Map();
      r.timestamp.forEach((ts, idx) => {
        const c = (adjusted && r.indicators.adjclose?.[0]?.adjclose?.[idx]) || r.indicators.quote[0].close[idx];
        if (c != null) close.set(new Date((ts + off) * 1000).toISOString().slice(0, 10), c);
      });
      const splits = Object.values(r.events?.splits ?? {}).map((s) => ({
        date: new Date((s.date + off) * 1000).toISOString().slice(0, 10),
        ratio: s.numerator / s.denominator,
      }));
      return { close, splits };
    } catch (e) {
      lastErr = e;
      await new Promise((r) => setTimeout(r, 1500 * (i + 1)));
    }
  }
  throw new Error(`Yahoo ${symbol}: ${lastErr?.message}`);
}

const needed = new Map(holdings.map((h) => [h.symbol, false]));
["^GSPC", "GBPUSD=X", "EURUSD=X", "ARS=X"].forEach((s) => needed.set(s, false));
for (const b of benchmarkDefs) {
  needed.set(b.symbol, !!b.adjusted);
  if (b.fallbackSymbol) needed.set(b.fallbackSymbol, !!b.adjusted);
}
// Optional data: a failure here degrades gracefully instead of aborting the refresh.
const optional = new Set(["EURUSD=X", "ARS=X"]);
benchmarkDefs.forEach((b) => (b.group === "fund" || b.fallbackSymbol) && optional.add(b.symbol));
const data = {};
for (const [s, adjusted] of needed) {
  try {
    data[s] = await fetchSeries(s, adjusted);
  } catch (e) {
    if (optional.has(s)) console.warn(`warn: ${e.message} (skipped)`);
    else throw e;
  }
}

// ---------- helpers ----------
const calendar = [...data["^GSPC"].close.keys()].filter((d) => d >= CHART_FROM).sort();

const ffCache = {};
function px(symbol, date) {
  // last known close on or before `date` (forward fill)
  const c = (ffCache[symbol] ??= (() => {
    const m = new Map();
    let last = null;
    const all = [...data[symbol].close.keys()].sort();
    const idx = new Map(all.map((d) => [d, data[symbol].close.get(d)]));
    return { all, idx, m, last };
  })());
  let lo = 0, hi = c.all.length - 1, found = null;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (c.all[mid] <= date) { found = c.all[mid]; lo = mid + 1; } else hi = mid - 1;
  }
  return found ? c.idx.get(found) : null;
}
const splitFactor = (symbol, afterDate) =>
  (data[symbol]?.splits ?? []).filter((s) => s.date > afterDate).reduce((a, s) => a * s.ratio, 1);

function fxToUsd(ccy, date) {
  if (ccy === "USD") return 1;
  if (ccy === "EUR") return (data["EURUSD=X"] && px("EURUSD=X", date)) || 1.11;
  if (ccy === "ARS") return 1 / ((data["ARS=X"] && px("ARS=X", date)) || 14.5);
  throw new Error(`currency ${ccy}`);
}

// ---------- portfolio model (USD) ----------
const byTicker = Object.fromEntries(holdings.map((h) => [h.ticker, h]));
const initialUsd = account.initialCapitalGbp * px("GBPUSD=X", START);
let cash = initialUsd;
const pos = {}; // ticker -> state
let txIdx = 0;

function applyTrade(t) {
  const h = byTicker[t.asset];
  const fx = fxToUsd(t.currency, t.date);
  const price = t.price * fx;
  const sign = t.side === "buy" ? 1 : -1;
  const p = (pos[t.asset] ??= { qty: 0, avg: 0, cost: 0, lastPx: 0 });
  if (h?.kind === "cfd") {
    if (sign > 0) {
      p.avg = (p.qty * p.avg + t.qty * price) / (p.qty + t.qty);
      p.qty += t.qty;
    } else {
      cash += t.qty * (price - p.avg);
      p.qty -= t.qty;
    }
  } else if (h) {
    const q = t.qty * (h.noSplitAdjust ? 1 : splitFactor(h.symbol, t.date));
    if (sign > 0) {
      cash -= t.qty * price;
      p.cost += t.qty * price;
      p.qty += q;
    } else {
      cash += t.qty * price;
      p.cost -= (p.cost * q) / p.qty;
      p.qty -= q;
    }
  } else {
    // Position closed within days (no market data needed): carried at last trade price.
    cash -= sign * t.qty * price;
    p.qty += sign * t.qty;
    p.lastPx = price;
  }
}

function equityAt(date) {
  let total = cash;
  const values = {};
  for (const [tk, p] of Object.entries(pos)) {
    const h = byTicker[tk];
    if (!h) { total += p.qty * p.lastPx; continue; }
    if (p.qty <= 1e-9) { values[tk] = null; continue; }
    const close = px(h.symbol, date);
    if (h.kind === "cfd") {
      total += p.qty * (close - p.avg);
      values[tk] = p.qty * close;
    } else {
      const v = p.qty * close * (h.noSplitAdjust ? splitFactor(h.symbol, date) : 1);
      total += v;
      values[tk] = v;
    }
  }
  return { total, values };
}

// ---------- series ----------
// Benchmarks start with the same capital as the portfolio on the start date.
const bench = benchmarkDefs
  .map((b) => {
    const symbol = data[b.symbol] ? b.symbol : b.fallbackSymbol;
    const label = symbol === b.symbol ? b.name : b.name.replace("total return", "price");
    return symbol && data[symbol] && data[symbol].close.size > 0
      ? { ...b, symbol, name: label, scale: initialUsd / px(symbol, START) }
      : null;
  })
  .filter(Boolean);

const r2 = (n) => (n == null ? null : Math.round(n * 100) / 100);
const days = [];
for (const date of calendar) {
  while (txIdx < transactions.length && transactions[txIdx].date <= date) applyTrade(transactions[txIdx++]);
  const { total, values } = equityAt(date);
  days.push({
    date,
    total,
    values,
    bench: Object.fromEntries(bench.map((b) => [b.key, px(b.symbol, date) * b.scale])),
  });
}

// Funds are only shown when they returned less than the portfolio over the same period.
const portfolioMultiple = days[days.length - 1].total / initialUsd;
const multipleOfBench = (b) => days[days.length - 1].bench[b.key] / initialUsd;
const shown = bench.filter((b) => b.group === "core" || multipleOfBench(b) < portfolioMultiple);
const excluded = bench
  .filter((b) => !shown.includes(b))
  .map((b) => ({ key: b.key, name: b.name, multiple: r2(multipleOfBench(b)) }));

// weekly sampling (last trading day of each week) + the final day
const weekKey = (d) => {
  const t = new Date(d + "T00:00:00Z");
  const monday = new Date(t.getTime() - ((t.getUTCDay() + 6) % 7) * 86400000);
  return monday.toISOString().slice(0, 10);
};
const sampled = days.filter((d, i) => i === days.length - 1 || weekKey(d.date) !== weekKey(days[i + 1].date));

const tickers = holdings.map((h) => h.ticker);
const valueSeries = sampled.map((d) => ({
  date: d.date,
  PORTFOLIO: r2(d.total),
  ...Object.fromEntries(shown.map((b) => [b.key, r2(d.bench[b.key])])),
  ...Object.fromEntries(tickers.map((t) => [t, r2(d.values[t] ?? null)])),
}));

// Indexed series (start date = 100). Assets use their market price (split-adjusted).
const startDay = days.find((d) => d.date >= START);
const base = { PORTFOLIO: startDay.total, ...startDay.bench };
const assetBase = Object.fromEntries(
  holdings.map((h) => [h.ticker, px(h.symbol, startDay.date)]),
);
const indexSeries = sampled.map((d) => ({
  date: d.date,
  PORTFOLIO: r2((d.total / base.PORTFOLIO) * 100),
  ...Object.fromEntries(shown.map((b) => [b.key, r2((d.bench[b.key] / base[b.key]) * 100)])),
  ...Object.fromEntries(
    holdings.map((h) => [
      h.ticker,
      d.date < START ? null : r2((px(h.symbol, d.date) / assetBase[h.ticker]) * 100),
    ]),
  ),
}));

const last = days[days.length - 1];
const gbpUsd = px("GBPUSD=X", last.date);
const composition = holdings.map((h) => ({
  ticker: h.ticker,
  name: h.name,
  sector: h.sector,
  value: r2(last.values[h.ticker] ?? 0),
}));

// ---------- reconciliation against the reported figures ----------
const reportedUsd = account.accountValueGbp * gbpUsd;
const reconciliation = {
  modelValueUsd: r2(last.total),
  reportedValueUsd: r2(reportedUsd),
  differencePct: r2(((last.total - reportedUsd) / reportedUsd) * 100),
  perAsset: holdings.map((h) => {
    const p = pos[h.ticker];
    const close = px(h.symbol, last.date);
    const modelPnl =
      h.kind === "cfd"
        ? p.qty * (close - p.avg)
        : p.qty * close * (h.noSplitAdjust ? splitFactor(h.symbol, last.date) : 1) - p.cost;
    return {
      ticker: h.ticker,
      modelPnlUsd: r2(modelPnl),
      reportedPnlUsd: r2(h.reportedProfitGbp * gbpUsd),
      modelPriceUsd: r2(close),
      reportedPriceUsd: h.reportedPriceUsd,
    };
  }),
};

const out = {
  meta: {
    generatedAt: new Date().toISOString(),
    asOf: last.date,
    currency: "USD",
    startDate: START,
    gbpUsdNow: r2(gbpUsd * 10000) / 10000,
    gbpUsdStart: r2(px("GBPUSD=X", START) * 10000) / 10000,
    initialCapitalUsd: r2(initialUsd),
    modelValueUsd: r2(last.total),
    benchmarks: Object.fromEntries(shown.map((b) => [b.key, { name: b.name, group: b.group }])),
    excludedBenchmarks: excluded,
    source: "Yahoo Finance (prices, FX) + La Bolsa Virtual transactions",
  },
  valueSeries,
  indexSeries,
  composition,
  reconciliation,
};

// Sanity check: bad upstream data must never replace the committed snapshot.
if (Math.abs(reconciliation.differencePct) > 10) {
  throw new Error(`modelled value is ${reconciliation.differencePct}% away from the reported one`);
}

await mkdir(new URL("data/generated/", root), { recursive: true });
await writeFile(new URL("data/generated/portfolio.json", root), JSON.stringify(out));

console.log(`as of ${last.date} | GBPUSD ${gbpUsd.toFixed(4)} | initial $${initialUsd.toFixed(0)}`);
console.log(`model $${last.total.toFixed(0)} vs reported $${reportedUsd.toFixed(0)} (${reconciliation.differencePct}%)`);
console.table(reconciliation.perAsset);
const s = valueSeries[valueSeries.length - 1];
console.log(`portfolio ${(s.PORTFOLIO / initialUsd).toFixed(2)}x`);
for (const b of shown) console.log(`  shown    ${b.name}: ${multipleOfBench(b).toFixed(2)}x`);
for (const b of excluded) console.log(`  excluded ${b.name}: ${b.multiple}x`);
