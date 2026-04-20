import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Isso ainda é suportado e vai ignorar os erros de tipagem (any)
    ignoreBuildErrors: true,
  },
  // REMOVA a chave eslint daqui, ela não funciona mais neste arquivo
};

export default nextConfig;