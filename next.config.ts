import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.s3.*.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.s3.amazonaws.com",
        pathname: "/**",
      },
    ],
    // Bypass Next.js image optimisation for S3 pre-signed URLs in development.
    // Pre-signed URLs are valid for only 1 h; the optimiser may cache the URL
    // and attempt to re-use it after it has expired.
    unoptimized: true,
  },
};

export default nextConfig;
