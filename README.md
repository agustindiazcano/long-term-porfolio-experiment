# Long-Term Portfolio Experiment

Data visualization front end for a long-term **buy & hold** investment experiment started in **March 2016** with £100,000 of simulated capital. Positions were bought using **fundamental and macroeconomic analysis**, among other factors, and left untouched for over a decade without active trading.

🌐 Site: https://agustindiazcano.github.io/long-term-porfolio-experiment/

## Data source

The analyzed portfolio is **public** and available on [La Bolsa Virtual (profile marcelogallardiola)](https://www.labolsavirtual.com/marcelogallardiola), with all the 2016 evidence transactions, **unmodified**. This project only visualizes it.

Positions: Gold, Crude Oil, JP Morgan Chase, Facebook (Meta), Alibaba, First Solar, Tesla Motors, Google (Alphabet), Starbucks, Silver, Amazon.com, Apple, NortonLifeLock (Symantec), Vertex Pharmaceuticals and Natural Gas.

## The Tesla case

The Tesla position was taken when short interest hit an all-time record and market consensus was betting against the company. According to the project context, its market cap has grown from ~US$34 billion (2016) to ~US$1.48 trillion today (~43x).

## What it shows

- Explanation of the experiment and the data source.
- Account performance indicators (initial capital, account value, invested capital, commissions, etc.).
- Historical chart of the whole portfolio (base 100 = March 2016), with the option to select each asset and overlay it.
- Pie chart of the portfolio composition.
- Dark (default) and light mode.
- Footer with the author and the month and year of the last update, recomputed on every deploy.

> ⚠️ The account figures come from the public portfolio, but the **charts use illustrative data** (initial weights and per-asset performance) until the real transactions are loaded. Replace them by editing `data/holdings.ts` and `lib/data.ts`.

## SEO and LLMs

- Metadata, Open Graph, Twitter Card, JSON-LD, canonical and `sitemap.xml`.
- `public/robots.txt` explicitly allows search and AI crawlers.
- `public/llms.txt` explains the project to LLMs. **It is updated whenever the README or the project changes** (see `AGENTS.md`).

## Stack

Next.js (App Router, static export) · TypeScript · Recharts

## Development

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck
npm run build      # outputs ./out
```

## Deploying to GitHub Pages

The `.github/workflows/deploy.yml` workflow builds and publishes on every push to `main` (Pages source set to GitHub Actions). The `basePath` is taken from the repo name (`NEXT_PUBLIC_BASE_PATH`). Since every push triggers a build, the footer's "Last update" reflects the month and year of the last push.

> Note: crawlers only read `robots.txt` at the domain root; on a project page (`user.github.io/repo/`) that root is not under your control. With a custom domain it works as is.

## Disclaimer

Personal, educational project. Not investment advice.

## License

[MIT](LICENSE) © 2026 Agustín Díaz-Cano
