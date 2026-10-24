import Dashboard from "@/components/Dashboard";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import { ACCOUNT } from "@/data/holdings";
import { compositionByAsset, compositionBySector, multipleOf, portfolio } from "@/lib/data";
import { AUTHOR, REPO_URL, SOURCE_URL } from "@/lib/site";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
const gbp = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" });

function yearsBetween(from: string, to: string) {
  return (new Date(to).getTime() - new Date(from).getTime()) / (365.25 * 86400000);
}

export default function Home() {
  const { meta } = portfolio;
  const fx = meta.gbpUsdNow;

  const accountValueUsd = ACCOUNT.accountValueGbp * fx;
  const multiple = accountValueUsd / meta.initialCapitalUsd;
  const years = yearsBetween(meta.startDate, meta.asOf);
  const cagr = (m: number) => (Math.pow(m, 1 / years) - 1) * 100;

  const sp500 = multipleOf("SP500");
  const brk = multipleOf("BRK");

  const heroStats = [
    { label: "Initial capital (Feb 2016)", value: usd.format(meta.initialCapitalUsd) },
    { label: "Account value today", value: usd.format(accountValueUsd) },
    { label: "Portfolio multiple", value: `${multiple.toFixed(1)}x`, sub: `~${cagr(multiple).toFixed(0)}% per year` },
    { label: "S&P 500 (total return)", value: `${sp500.toFixed(1)}x`, sub: `~${cagr(sp500).toFixed(0)}% per year` },
    { label: "Berkshire Hathaway", value: `${brk.toFixed(1)}x`, sub: `~${cagr(brk).toFixed(0)}% per year` },
  ];

  const kpis = [
    { label: "Invested capital", value: usd.format(ACCOUNT.investedCapitalGbp * fx) },
    { label: "Available capital", value: usd.format(ACCOUNT.availableCapitalGbp * fx) },
    { label: "Balance", value: usd.format(ACCOUNT.balanceGbp * fx) },
    { label: "Margin used", value: usd.format(ACCOUNT.marginUsedGbp * fx) },
    { label: "Commissions paid", value: usd.format(ACCOUNT.commissionsPaidGbp * fx) },
  ];

  const asOf = new Intl.DateTimeFormat("en-GB", { dateStyle: "long", timeZone: "UTC" }).format(
    new Date(meta.asOf),
  );

  return (
    <>
      <Nav />
      <main className="container" id="top">
        <section className="hero">
          <p className="eyebrow">Buy &amp; hold · Since March 2016</p>
          <h1>
            Long-Term <span className="grad">Portfolio Experiment</span>
          </h1>
          <p className="lead">
            A decade-long experiment built on fundamental and macroeconomic analysis, started with
            £100,000 of simulated capital and left untouched. All figures in US dollars. By {AUTHOR}.
          </p>
          <dl className="hero-stats">
            {heroStats.map((s) => (
              <div key={s.label} className="stat">
                <dt>{s.label}</dt>
                <dd>{s.value}</dd>
                {s.sub && <dd className="sub">{s.sub}</dd>}
              </div>
            ))}
          </dl>
        </section>

        <section className="card" id="what-is-it" aria-labelledby="what-is-it-h">
          <h2 id="what-is-it-h">What is this about?</h2>
          <p>
            It is a long-term (<em>hold</em>) experiment in which positions were bought using{" "}
            <strong>fundamental and macroeconomic analysis</strong>, among other factors, and then
            left untouched for over a decade without active trading. The idea is to observe how a
            portfolio built on conviction evolves, without reacting to short-term noise.
          </p>
          <div className="callout">
            <strong>The Tesla case.</strong> The position was taken when short interest in the
            stock hit an all-time record and market consensus was betting against the company.
            According to the project context, its market cap has grown from ~US$34 billion in 2016
            to ~US$1.48 trillion today (roughly 43x).
          </div>
        </section>

        <section className="card" id="performance" aria-labelledby="performance-h">
          <h2 id="performance-h">Account performance</h2>
          <dl className="kpis">
            {kpis.map((k) => (
              <div key={k.label} className="kpi">
                <dt>{k.label}</dt>
                <dd>{k.value}</dd>
              </div>
            ))}
          </dl>
          <p className="note">
            The platform reports in pounds ({gbp.format(ACCOUNT.initialCapitalGbp)} initial,{" "}
            {gbp.format(ACCOUNT.accountValueGbp)} today). Here everything is converted to US dollars:
            the initial capital at the GBP/USD rate of February 2016 ({meta.gbpUsdStart.toFixed(4)})
            and current values at today&apos;s rate ({fx.toFixed(4)}). Data as of {asOf}.
          </p>
        </section>

        <Dashboard
          valueSeries={portfolio.valueSeries}
          indexSeries={portfolio.indexSeries}
          benchmarkNames={meta.benchmarks}
          byAsset={compositionByAsset()}
          bySector={compositionBySector()}
        />

        <section className="card" id="method" aria-labelledby="method-h">
          <h2 id="method-h">How the numbers are built</h2>
          <p>
            The portfolio is rebuilt from the 64 public transactions (22 Feb – 7 Apr 2016) and daily
            prices from Yahoo Finance, converted to USD with the GBP/USD rate of each date. Stock
            splits are applied to the share counts. The benchmarks start with the same capital on the
            portfolio start date. The modelled value is within about 1% of the value reported by the
            platform; the small gap comes from dividends and the exact timing of quotes. Data is
            refreshed automatically every day.
          </p>
          <p className="note">
            One caveat: the platform did not apply the 2022 Alphabet split to the Google position
            (35 shares), and this site reproduces it as reported. Educational project, not
            investment advice.
          </p>
        </section>

        <section className="card" id="source" aria-labelledby="source-h">
          <h2 id="source-h">Data source</h2>
          <p>
            The analyzed portfolio is <strong>public</strong> and available on{" "}
            <a href={SOURCE_URL} target="_blank" rel="noopener noreferrer">
              La Bolsa Virtual (profile marcelogallardiola)
            </a>
            , with all the 2016 evidence transactions, <strong>unmodified</strong>. This site only
            visualizes it. Open source (MIT) on{" "}
            <a href={REPO_URL} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            .
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
