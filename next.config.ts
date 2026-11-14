import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    remotePatterns: [
      // Avatares (SVG): renderize com `unoptimized`, o otimizador não processa SVG.
      { protocol: "https", hostname: "api.dicebear.com" },
      // Imagens de produtos: URLs externas cadastradas pelo admin (D3).
      { protocol: "https", hostname: "**" },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
