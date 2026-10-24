import holdingsJson from "./holdings.json";
import accountJson from "./account.json";

// Current positions of the analyzed public portfolio. Quantities and entry prices come from
// data/transactions.json; scripts/update-data.mjs turns them into data/generated/portfolio.json.
export interface Holding {
  ticker: string;
  name: string;
  sector: string;
  /** Yahoo Finance symbol used for prices. */
  symbol: string;
  kind: "stock" | "cfd";
  /** Figures reported by the platform, only used to validate the reconstruction. */
  reportedProfitGbp: number;
  reportedPriceUsd: number;
  /** The platform did not apply a stock split to this position (see README). */
  noSplitAdjust?: boolean;
}

export const holdings = holdingsJson as Holding[];

export const START_DATE = accountJson.startDate;

/** Account figures as reported in GBP by the public portfolio. */
export const ACCOUNT = accountJson;
