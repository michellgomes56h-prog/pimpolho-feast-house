import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 90 = fotos em alta qualidade; formatos modernos (AVIF/WebP) mantêm o arquivo leve
    qualities: [75, 90],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
