import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  typescript: {
    ignoreBuildErrors: true, // Consider fixing this in production
  },

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "storage.aayushmanamatya.com.np",
      },
    ],
    formats: ["image/avif", "image/webp"], // Modern formats for better compression
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // CSS optimization
  experimental: {
    optimizeCss: true, // Requires: npm install critters
    optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"], // Add packages you use
  },

  // Enable compression
  compress: true,

  // Use SWC minifier (faster than Terser)
  swcMinify: true,

  // Compiler optimizations
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production" ?
        { exclude: ["error", "warn"] }
      : false,
  },

  // Headers for caching and security
  async headers() {
    return [
      // Cache static assets aggressively
      {
        source: "/:all*(svg|jpg|jpeg|png|gif|webp|avif|ico|woff|woff2|ttf|otf)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Cache CSS and JS chunks
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Preconnect hints for external domains
      {
        source: "/:path*",
        headers: [
          {
            key: "Link",
            value: [
              "<https://storage.aayushmanamatya.com.np>; rel=preconnect",
              "<https://res.cloudinary.com>; rel=preconnect",
              "<https://gateway-219k.onrender.com>; rel=dns-prefetch",
            ].join(", "),
          },
        ],
      },
    ];
  },

  // API rewrites
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

  // Production source maps (optional - set to false for smaller builds)
  productionBrowserSourceMaps: false,

  // Power output for static optimization
  output: "standalone", // For Docker/serverless deployments (optional)
};

export default nextConfig;
