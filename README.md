# Experimento de portfolio a largo plazo

Front de visualización de datos de un experimento de inversión **buy & hold** de largo plazo, iniciado en **marzo de 2016**. Las posiciones se compraron con criterio de análisis fundamental, contexto macro y otros factores, y se mantienen sin operar activamente.

## Qué muestra

- Explicación del experimento.
- Gráfico histórico del portfolio completo (base 100 = marzo 2016), con la posibilidad de seleccionar cada acción para superponerla.
- Gráfico de torta con la composición actual del portfolio.
- Footer con el autor y la fecha (mes y año) de la última actualización, que se recalcula en cada deploy.

> Los datos actuales son **de ejemplo**. Se reemplazan editando `data/holdings.ts` y `lib/data.ts`.

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

El `basePath` se toma automáticamente del nombre del repo (`NEXT_PUBLIC_BASE_PATH`). Como cada push dispara un build, el "Last update" del footer refleja el mes y año del último push.

## Disclaimer

Proyecto personal y educativo. No es una recomendación de inversión.

## Licencia

[MIT](LICENSE) © 2026 Agustín Díaz-Cano
