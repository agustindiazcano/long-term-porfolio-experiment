# Experimento de portfolio a largo plazo

Front de visualización de datos de un experimento de inversión **buy & hold** de largo plazo, iniciado en **marzo de 2016** con £100.000 de capital simulado. Las posiciones se compraron con criterio de **análisis fundamental, macroeconómico** y otros factores, y se dejaron correr más de una década sin operar activamente.

🌐 Sitio: https://agustindiazcano.github.io/long-term-porfolio-experiment/

## Fuente de los datos

El portfolio analizado es **público** y está en [La Bolsa Virtual (perfil marcelogallardiola)](https://www.labolsavirtual.com/marcelogallardiola), con todas las transacciones de evidencia de 2016, **sin modificaciones**. Este proyecto solo lo visualiza.

Posiciones: Oro, Petróleo Crudo, JP Morgan Chase, Facebook (Meta), Alibaba, First Solar, Tesla Motors, Google (Alphabet), Starbucks, Plata, Amazon.com, Apple, NortonLifeLock (Symantec), Vertex Pharmaceuticals y Gas natural.

## El caso Tesla

La posición en Tesla se tomó cuando el interés vendedor (short interest) marcaba un récord histórico y el consenso del mercado apostaba en contra de la compañía. Según el contexto del proyecto, su capitalización pasó de ~US$34.000 M (2016) a ~US$1,48 billones hoy (~43x).

## Qué muestra

- Explicación del experimento y fuente de los datos.
- Indicadores de rendimiento de la cuenta (capital inicial, valoración, capital invertido, comisiones, etc.).
- Gráfico histórico del portfolio completo (base 100 = marzo 2016), con selección de cada activo para superponerlo.
- Gráfico de torta con la composición del portfolio.
- Modo oscuro (por defecto) y claro.
- Footer con autor y fecha (mes y año) de la última actualización, recalculada en cada deploy.

> ⚠️ Las cifras de la cuenta son las del portfolio público, pero los **gráficos usan datos ilustrativos** (pesos iniciales y evolución por activo) hasta cargar las transacciones reales. Se reemplazan editando `data/holdings.ts` y `lib/data.ts`.

## SEO y LLMs

- Metadata, Open Graph, Twitter Card, JSON-LD, canonical y `sitemap.xml`.
- `public/robots.txt` permite explícitamente crawlers de buscadores y de IA.
- `public/llms.txt` explica el proyecto para LLMs. **Se actualiza cuando cambia el README o el proyecto** (ver `AGENTS.md`).

## Stack

Next.js (App Router, export estático) · TypeScript · Recharts

## Desarrollo

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck
npm run build      # genera ./out
```

## Deploy en GitHub Pages

El workflow `.github/workflows/deploy.yml` compila y publica en cada push a `main`. Pasos únicos en el repo:

1. `Settings → Pages → Build and deployment → Source: GitHub Actions`.
2. Hacer push a `main`.

El `basePath` se toma del nombre del repo (`NEXT_PUBLIC_BASE_PATH`). Como cada push dispara un build, el "Última actualización" del footer refleja el mes y año del último push.

> Nota: los crawlers solo leen `robots.txt` en la raíz del dominio; en una project page (`usuario.github.io/repo/`) esa raíz no es controlable. Con dominio propio funciona tal cual.

## Disclaimer

Proyecto personal y educativo. No es una recomendación de inversión.

## Licencia

[MIT](LICENSE) © 2026 Agustín Díaz-Cano
