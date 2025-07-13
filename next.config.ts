import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin('./src/config/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true,
  },
  images: {
    unoptimized: true,
  },
};

export default withNextIntl(nextConfig);
