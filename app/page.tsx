import Dashboard from "@/components/Dashboard";
import Footer from "@/components/Footer";
import { buildSeries, currentComposition } from "@/lib/data";

export default function Home() {
  const series = buildSeries();
  const composition = currentComposition(series);

  return (
    <>
      <main className="container">
        <header>
          <h1>Experimento de portfolio a largo plazo</h1>
          <p className="lead">
            Un experimento de inversión <strong>buy &amp; hold</strong> de largo plazo, iniciado en{" "}
            <strong>marzo de 2016</strong>.
          </p>
        </header>

        <section className="card">
          <h2>¿De qué se trata?</h2>
          <p>
            Es un experimento de largo plazo en el que las posiciones se compraron con criterio de
            análisis fundamental, contexto macroeconómico y otros factores, y luego se mantienen
            (hold) sin operar activamente. La idea es observar cómo evoluciona una cartera
            construida con convicción a lo largo de los años, sin reaccionar al ruido del corto
            plazo.
          </p>
          <p className="note">
            Los datos que se muestran actualmente son de ejemplo y se reemplazarán por los reales.
            Esto no es una recomendación de inversión.
          </p>
        </section>

        <Dashboard series={series} composition={composition} />
      </main>
      <Footer />
    </>
  );
}
