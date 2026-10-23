# AGENTS.md

Guía para agentes (Claude Code u otros) que trabajen en este repo.

## Proyecto

Front estático (Next.js + TypeScript, `output: "export"`) que visualiza un experimento de portfolio buy & hold iniciado en marzo de 2016. Se despliega en GitHub Pages. Licencia MIT.

## Estructura

- `app/` — layout, página y estilos globales.
- `components/` — `Dashboard` (gráfico histórico + torta, client component) y `Footer`.
- `data/holdings.ts` — posiciones del portfolio (hoy datos de ejemplo).
- `lib/` — generación de series y composición, colores.
- `.github/workflows/deploy.yml` — build y deploy a Pages en cada push a `main`.

## Flujo de trabajo

- **Commit al terminar cada tarea**, con mensaje claro y breve.
- **Nunca hacer push sin preguntar** al dueño del repo cuándo quiere hacerlo.
- Los pushes van directo a `main` (proyecto chico, no hace falta PR).
- Antes de commitear: `npm run typecheck` y `npm run build` deben pasar.

## Convenciones

- Idioma de la UI y docs: español.
- El footer debe seguir diciendo "© Agustín Díaz-Cano 2026" y la última actualización (mes y año) vía `NEXT_PUBLIC_LAST_UPDATE`, definida en `next.config.ts`.
- Mantener compatibilidad con export estático (sin APIs de servidor ni `next/image` optimizado).
- No agregar dependencias sin necesidad.
