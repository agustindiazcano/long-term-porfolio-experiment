import Dashboard from "@/components/Dashboard";
import Footer from "@/components/Footer";
import ThemeToggle from "@/components/ThemeToggle";
import { ACCOUNT, START_DATE } from "@/data/holdings";
import { buildSeries, currentComposition } from "@/lib/data";
import { AUTHOR, REPO_URL, SOURCE_URL } from "@/lib/site";

const gbp = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" });

function yearsSinceStart() {
  const [y, m] = START_DATE.split("-").map(Number);
  const [ey, em] = ACCOUNT.asOf.split("-").map(Number);
  return ey - y + (em - m) / 12;
}

export default function Home() {
  const series = buildSeries();
  const composition = currentComposition(series);

  const multiple = ACCOUNT.accountValue / ACCOUNT.initialCapital;
  const annualized = (Math.pow(multiple, 1 / yearsSinceStart()) - 1) * 100;

  const kpis = [
    { label: "Initial capital (Mar 2016)", value: gbp.format(ACCOUNT.initialCapital) },
    { label: "Account value", value: gbp.format(ACCOUNT.accountValue) },
    { label: "Multiple / annualized", value: `${multiple.toFixed(1)}x · ~${annualized.toFixed(0)}% per year` },
    { label: "Invested capital", value: gbp.format(ACCOUNT.investedCapital) },
    { label: "Available capital", value: gbp.format(ACCOUNT.availableCapital) },
    { label: "Balance", value: gbp.format(ACCOUNT.balance) },
    { label: "Margin used", value: gbp.format(ACCOUNT.marginUsed) },
    { label: "Commissions paid", value: gbp.format(ACCOUNT.commissionsPaid) },
  ];

  return (
    <>
      <main className="container">
        <div className="topbar">
          <span className="byline">by {AUTHOR}</span>
          <ThemeToggle />
        </div>
        <header>
          <h1>Long-Term Portfolio Experiment</h1>
          <p className="lead">
            A <strong>buy &amp; hold</strong> investment experiment started in{" "}
            <strong>March 2016</strong> with £100,000 of simulated capital.
          </p>
        </header>

        <section className="card" aria-labelledby="what-is-it">
          <h2 id="what-is-it">What is this about?</h2>
          <p>
            It is a long-term (<em>hold</em>) experiment in which positions were bought using{" "}
            <strong>fundamental and macroeconomic analysis</strong>, among other factors, and then
            left untouched for over a decade without active trading. The idea is to observe how a
            portfolio built on conviction evolves, without reacting to short-term noise.
          </p>
          <p>
            <strong>The Tesla case:</strong> the position was taken when short interest in the
            stock hit an all-time record and market consensus was betting against the company.
            According to the project context, its market cap has grown from ~US$34 billion in 2016
            to ~US$1.48 trillion today (roughly 43x).
          </p>
        </section>

        <section className="card" aria-labelledby="source">
          <h2 id="source">Data source</h2>
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

        <section className="card" aria-labelledby="performance">
          <h2 id="performance">Account performance</h2>
          <dl className="kpis">
            {kpis.map((k) => (
              <div key={k.label} className="kpi">
                <dt>{k.label}</dt>
                <dd>{k.value}</dd>
              </div>
            ))}
          </dl>
          <p className="note">Values in pounds sterling (£), taken from the public portfolio.</p>
        </section>

        <Dashboard series={series} composition={composition} />

        <p className="note">
          The charts use <strong>illustrative data</strong> (per-asset weights and evolution) until
          the real transactions are loaded; the account figures above are those of the public
          portfolio. Educational project, not investment advice.
        </p>
      </main>
      <Footer />
    </>
  );
}
