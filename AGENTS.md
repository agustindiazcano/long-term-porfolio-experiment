# AGENTS.md

Guide for agents (Claude Code or others) working in this repo.

## Project

Static front end (Next.js + TypeScript, `output: "export"`) that visualizes a buy & hold portfolio experiment started in March 2016. Deployed to GitHub Pages. MIT license.

## Language

**The project language is English.** All UI text, documentation, code comments, commit messages and metadata must be written in English. (The owner may chat in Spanish; that does not change the project language.)

## Structure

- `app/` — layout, page, sitemap and global styles.
- `components/` — `Dashboard` (historical chart + pie, client component), `Footer`, `ThemeToggle`.
- `data/holdings.ts` — portfolio positions and account figures.
- `lib/` — series/composition generation, colors, site constants.
- `public/` — `robots.txt` and `llms.txt`.
- `.github/workflows/deploy.yml` — build and deploy to Pages on every push to `main`.

## Workflow

- **Commit when each task is done**, with a clear, short message.
- **Never push without asking** the repo owner when they want to push (unless they explicitly say to push).
- Pushes go straight to `main` (small project, no PRs needed).
- Before committing: `npm run typecheck` and `npm run build` must pass.

## Documentation for LLMs

- Whenever the `README.md` or the project changes (data, sections, stack, URLs), **check whether `public/llms.txt` needs updating** and do it in the same commit.
- `public/robots.txt` holds the user-agent list provided by the owner; do not trim it without asking.

## Data source

- The portfolio is public (La Bolsa Virtual, profile marcelogallardiola, 2016 transactions unmodified). Keep that mention on the site, in the README and in `llms.txt`.
- The data in `data/holdings.ts` (weights and series) is illustrative until the real data is loaded; do not present it as real.

## Conventions

- Dark theme by default with a light/dark toggle (`data-theme`); use CSS variables, not hard-coded colors.
- Keep SEO in place: metadata in `app/layout.tsx`, `app/sitemap.ts`, JSON-LD.
- The footer must keep saying "© Agustín Díaz-Cano 2026" plus the last update (month and year) via `NEXT_PUBLIC_LAST_UPDATE`, defined in `next.config.ts`.
- Keep static-export compatibility (no server APIs, no optimized `next/image`).
- Do not add dependencies unless necessary.
