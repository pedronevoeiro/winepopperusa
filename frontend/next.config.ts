import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
      {
        protocol: "https",
        hostname: "files.winepopperusa.com",
      },
    ],
  },
  async rewrites() {
    return [
      // Proxy /api/medusa to the Medusa backend
      {
        source: "/api/medusa/:path*",
        destination: `${process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"}/:path*`,
      },
    ]
  },
}

export default nextConfig
