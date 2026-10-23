export default function Footer() {
  const raw = process.env.NEXT_PUBLIC_LAST_UPDATE;
  const date = raw ? new Date(raw) : new Date();
  const lastUpdate = new Intl.DateTimeFormat("es-AR", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);

  return (
    <footer className="footer">
      <span>© Agustín Díaz-Cano 2026</span>
      <span>Última actualización: {lastUpdate}</span>
    </footer>
  );
}
