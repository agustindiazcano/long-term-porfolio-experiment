import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AUTHOR, REPO_URL, SITE_DESCRIPTION, SITE_NAME, SITE_URL, SOURCE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | ${AUTHOR}`,
    template: `%s | ${AUTHOR}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "portfolio largo plazo",
    "buy and hold",
    "análisis fundamental",
    "análisis macroeconómico",
    "experimento de inversión",
    "paper trading",
    "Tesla",
    "La Bolsa Virtual",
    AUTHOR,
  ],
  authors: [{ name: AUTHOR, url: REPO_URL }],
  creator: AUTHOR,
  publisher: AUTHOR,
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | ${AUTHOR}`,
    description: SITE_DESCRIPTION,
    locale: "es_AR",
  },
  twitter: {
    card: "summary",
    title: `${SITE_NAME} | ${AUTHOR}`,
    description: SITE_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0f17",
  colorScheme: "dark light",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  inLanguage: "es",
  author: { "@type": "Person", name: AUTHOR },
  license: "https://opensource.org/licenses/MIT",
  isBasedOn: SOURCE_URL,
};

// Aplica el tema guardado antes del primer paint (oscuro por defecto).
const themeScript = `try{var t=localStorage.getItem("theme");document.documentElement.dataset.theme=t==="light"?"light":"dark"}catch(e){document.documentElement.dataset.theme="dark"}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
