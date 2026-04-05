import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  // Redirects for video assets (R2 hosted)
  // Benefits: Paper links never break, flexible to change video source
  async redirects() {
    return [
      {
        source: "/video",
        destination: "https://pub-471f90c3abac48ac88996b8ef195acd8.r2.dev/rosclaw-demo.mp4",
        permanent: false, // 307 redirect (temporary) - allows changing later
      },
      {
        source: "/demo",
        destination: "https://pub-471f90c3abac48ac88996b8ef195acd8.r2.dev/rosclaw-demo.mp4",
        permanent: false,
      },
      {
        source: "/video/:path*",
        destination: "https://pub-471f90c3abac48ac88996b8ef195acd8.r2.dev/:path*",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
