import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/job-seeker/:path*",
        destination: "https://gateway-219k.onrender.com/api/job-seeker/:path*",
      },
      {
        source: "/api/employer/:path*",
        destination: "https://gateway-219k.onrender.com/api/employer/:path*",
      },
      {
        source: "/api/account/:path*",
        destination: "https://gateway-219k.onrender.com/api/account/:path*",
      },
    ];
  },
};

export default nextConfig;
