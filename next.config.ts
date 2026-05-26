import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // ✅ Disable Vercel image optimization
  },
};

export default nextConfig;
