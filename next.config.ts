import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'https://lemonwebsite-backend.onrender.com/api/v1/:path*',
      },
    ];
  },
};

export default nextConfig;
