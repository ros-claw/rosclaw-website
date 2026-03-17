import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  distDir: 'dist',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default withNextIntl(nextConfig);
