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
- Account performance indicators, all in **US dollars** (the platform reports in GBP; see below).
- Historical chart (Feb 2016 to today) of the whole portfolio against the **S&P 500 (total return)** and **Berkshire Hathaway**, either as US$ value or indexed to 100, with each asset selectable to overlay it.
- Pie chart of the current composition, **by asset or by sector** (commodities, banks, technology, retail & consumer, EV & clean energy, healthcare).
- Dark (default) and light mode, sticky navigation, Roboto font.
- Footer with the author and the month and year of the last update.

## How the data works

The portfolio is rebuilt from the 64 public transactions (22 Feb – 7 Apr 2016) in `data/transactions.json`, with daily prices and FX from Yahoo Finance. `scripts/update-data.mjs` computes the portfolio value in USD (stock splits applied, CFDs marked to market, GBP/USD of each date) and writes `data/generated/portfolio.json`, which the site reads at build time.

- **Daily refresh:** a GitHub Actions cron job runs the script, commits the result and redeploys the site (`npm run update-data` does the same locally).
- **Validation:** the modelled value is within about 1% of the value reported by the platform, and per-asset profits match the reported ones.
- **GBP to USD:** the initial £100,000 is converted at the GBP/USD rate of February 2016; current values at today's rate.
- **Caveat:** the platform did not apply the 2022 Alphabet split to the Google position (35 shares); it is reproduced as reported.
- **Dates:** the account was opened on 22 Feb 2016; the portfolio as it stands today was built between 2 and 8 March 2016.

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
npm run update-data  # refresh prices from Yahoo Finance
npm run build      # outputs ./out
```

## Deploying to GitHub Pages

The `.github/workflows/deploy.yml` workflow builds and publishes on every push to `main` (Pages source set to GitHub Actions). The workflow also runs daily (cron) to refresh the data. The `basePath` is taken from the repo name (`NEXT_PUBLIC_BASE_PATH`). Since every push triggers a build, the footer's "Last update" reflects the month and year of the last push.

> Note: crawlers only read `robots.txt` at the domain root; on a project page (`user.github.io/repo/`) that root is not under your control. With a custom domain it works as is.

## Disclaimer

Personal, educational project. Not investment advice.

## License

[MIT](LICENSE) © 2026 Agustín Díaz-Cano
