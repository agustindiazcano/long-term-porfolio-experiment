import Dashboard from "@/components/Dashboard";
import Footer from "@/components/Footer";
import ThemeToggle from "@/components/ThemeToggle";
import { ACCOUNT, START_DATE } from "@/data/holdings";
import { buildSeries, currentComposition } from "@/lib/data";
import { AUTHOR, REPO_URL, SOURCE_URL } from "@/lib/site";

const gbp = new Intl.NumberFormat("es-AR", { style: "currency", currency: "GBP" });

function yearsSinceStart() {
  const [y, m] = START_DATE.split("-").map(Number);
  const [ey, em] = ACCOUNT.asOf.split("-").map(Number);
  return (ey - y) + (em - m) / 12;
}

export default function Home() {
  const series = buildSeries();
  const composition = currentComposition(series);

  const multiple = ACCOUNT.accountValue / ACCOUNT.initialCapital;
  const annualized = (Math.pow(multiple, 1 / yearsSinceStart()) - 1) * 100;

  const kpis = [
    { label: "Capital inicial (mar 2016)", value: gbp.format(ACCOUNT.initialCapital) },
    { label: "Valoración de la cuenta", value: gbp.format(ACCOUNT.accountValue) },
    { label: "Múltiplo / anualizado", value: `${multiple.toFixed(1)}x · ~${annualized.toFixed(0)}% anual` },
    { label: "Capital invertido", value: gbp.format(ACCOUNT.investedCapital) },
    { label: "Capital disponible", value: gbp.format(ACCOUNT.availableCapital) },
    { label: "Saldo", value: gbp.format(ACCOUNT.balance) },
    { label: "Garantía usada", value: gbp.format(ACCOUNT.marginUsed) },
    { label: "Comisiones pagadas", value: gbp.format(ACCOUNT.commissionsPaid) },
  ];

  return (
    <>
      <main className="container">
        <div className="topbar">
          <span className="byline">por {AUTHOR}</span>
          <ThemeToggle />
        </div>
        <header>
          <h1>Experimento de portfolio a largo plazo</h1>
          <p className="lead">
            Un experimento de inversión <strong>buy &amp; hold</strong> iniciado en{" "}
            <strong>marzo de 2016</strong> con £100.000 de capital simulado.
          </p>
        </header>

        <section className="card" aria-labelledby="que-es">
          <h2 id="que-es">¿De qué se trata?</h2>
          <p>
            Es un experimento de largo plazo (<em>hold</em>) en el que las posiciones se compraron
            con criterio de <strong>análisis fundamental, macroeconómico</strong> y otros factores, y
            luego se dejaron correr durante más de una década sin operar activamente. La idea es
            observar cómo evoluciona una cartera construida con convicción, sin reaccionar al ruido
            del corto plazo.
          </p>
          <p>
            <strong>El caso Tesla:</strong> la posición se tomó cuando el interés vendedor (short
            interest) en la acción marcaba un récord histórico y el consenso del mercado apostaba
            en contra de la compañía. Según el contexto del proyecto, su capitalización pasó de
            ~US$34.000 M en 2016 a ~US$1,48 billones hoy (aprox. 43 veces).
          </p>
        </section>

        <section className="card" aria-labelledby="fuente">
          <h2 id="fuente">Fuente de los datos</h2>
          <p>
            El portfolio analizado es <strong>público</strong> y está en{" "}
            <a href={SOURCE_URL} target="_blank" rel="noopener noreferrer">
              La Bolsa Virtual (perfil marcelogallardiola)
            </a>
            , con todas las transacciones de evidencia de 2016, <strong>sin modificaciones</strong>.
            Este sitio solo lo visualiza. Código abierto (MIT) en{" "}
            <a href={REPO_URL} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            .
          </p>
        </section>

        <section className="card" aria-labelledby="rendimiento">
          <h2 id="rendimiento">Rendimiento de la cuenta</h2>
          <dl className="kpis">
            {kpis.map((k) => (
              <div key={k.label} className="kpi">
                <dt>{k.label}</dt>
                <dd>{k.value}</dd>
              </div>
            ))}
          </dl>
          <p className="note">Valores en libras esterlinas (£), tomados del portfolio público.</p>
        </section>

        <Dashboard series={series} composition={composition} />

        <p className="note">
          Los gráficos usan <strong>datos ilustrativos</strong> (pesos y evolución por activo) hasta
          cargar las transacciones reales; las cifras de la cuenta de arriba sí son las del
          portfolio público. Proyecto educativo, no es una recomendación de inversión.
        </p>
      </main>
      <Footer />
    </>
  );
}
