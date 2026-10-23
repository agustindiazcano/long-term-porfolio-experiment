import type { NextConfig } from "next";

// En GitHub Actions se define NEXT_PUBLIC_BASE_PATH con el nombre del repo
// (ej. "/long-term-porfolio-experiment"). En local queda vacio.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  images: { unoptimized: true },
  trailingSlash: true,
  env: {
    // Se calcula en cada build, y el workflow hace build en cada push a main.
    NEXT_PUBLIC_LAST_UPDATE: new Date().toISOString(),
  },
};

export default nextConfig;
