export default function Footer() {
  const raw = process.env.NEXT_PUBLIC_LAST_UPDATE;
  const date = raw ? new Date(raw) : new Date();
  const lastUpdate = new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);

  return (
    <footer className="footer">
      <span>© Agustín Díaz-Cano 2026</span>
      <span>Last update: {lastUpdate}</span>
    </footer>
  );
}
