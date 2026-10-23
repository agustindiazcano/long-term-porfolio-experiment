import type { NextConfig } from "next";

// On GitHub Actions NEXT_PUBLIC_BASE_PATH is set to the repo name
// (e.g. "/long-term-porfolio-experiment"). Empty locally.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  images: { unoptimized: true },
  trailingSlash: true,
  env: {
    // Computed on every build; the workflow builds on every push to main.
    NEXT_PUBLIC_LAST_UPDATE: new Date().toISOString(),
  },
};

export default nextConfig;
