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

## Documentación para LLMs

- Siempre que se actualice el `README.md` o el proyecto (datos, secciones, stack, URLs), **evaluar si hay que actualizar `public/llms.txt`** y hacerlo en el mismo commit.
- `public/robots.txt` lleva la lista de user-agents provista por el dueño; no recortarla sin preguntar.

## Fuente de los datos

- El portfolio es público (La Bolsa Virtual, perfil marcelogallardiola, transacciones de 2016 sin modificaciones). Mantener esa mención en el sitio, el README y `llms.txt`.
- Los datos de `data/holdings.ts` (pesos y serie) son ilustrativos hasta cargar los reales; no presentarlos como reales.

## Convenciones

- Tema oscuro por defecto con toggle claro/oscuro (`data-theme`); usar variables CSS, no colores fijos.
- Mantener SEO: metadata en `app/layout.tsx`, `app/sitemap.ts`, JSON-LD.

- Idioma de la UI y docs: español.
- El footer debe seguir diciendo "© Agustín Díaz-Cano 2026" y la última actualización (mes y año) vía `NEXT_PUBLIC_LAST_UPDATE`, definida en `next.config.ts`.
- Mantener compatibilidad con export estático (sin APIs de servidor ni `next/image` optimizado).
- No agregar dependencias sin necesidad.
