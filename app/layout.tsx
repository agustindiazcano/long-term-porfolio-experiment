import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Experimento de portfolio a largo plazo",
  description:
    "Visualización de un experimento de inversión buy & hold iniciado en marzo de 2016.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
