/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  images: {
    unoptimized: true,
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
