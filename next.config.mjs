/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Ignora ESLint durante el proceso de build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
