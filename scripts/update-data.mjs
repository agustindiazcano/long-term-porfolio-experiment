// Refreshes data/generated/portfolio.json from Yahoo Finance.
// If the remote data is missing, incomplete or inconsistent, the committed snapshot
// (the last good data, used as the default) is kept and the build continues with it.
// Run: node scripts/update-data.mjs   (also runs daily in GitHub Actions)
import { access } from "node:fs/promises";

const snapshot = new URL("../data/generated/portfolio.json", import.meta.url);

try {
  await import("./build-data.mjs");
} catch (e) {
  console.warn(`warning: could not refresh data (${e.message})`);
  try {
    await access(snapshot);
    console.warn("Keeping the committed snapshot in data/generated/portfolio.json.");
  } catch {
    console.error("No committed snapshot available to fall back to.");
    process.exit(1);
  }
}
