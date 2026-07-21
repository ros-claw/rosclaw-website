/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "base-uri 'self'; object-src 'none'; frame-ancestors 'none'",
          },
          { key: "Permissions-Policy", value: "camera=(), geolocation=(), microphone=()" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/demo",
        destination: "https://pub-471f90c3abac48ac88996b8ef195acd8.r2.dev/rosclaw-demo.mp4",
        permanent: false,
      },
      {
        source: "/v/:path*",
        destination: "https://pub-471f90c3abac48ac88996b8ef195acd8.r2.dev/:path*",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
