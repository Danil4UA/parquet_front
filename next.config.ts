import createNextIntlPlugin from "next-intl/plugin";
import { RemotePattern } from "next/dist/shared/lib/image-config";

const withNextIntl = createNextIntlPlugin();

const remotePatterns: RemotePattern[] = [
  {
    protocol: "https",
    hostname: "firebasestorage.googleapis.com"
  },
  {
    protocol: "https",
    hostname: "effectparquet.s3.eu-north-1.amazonaws.com"
  }
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns,
    minimumCacheTTL: 3600,
  },
  webpack(config: any) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"]
    });
    return config;
  },
};

export default withNextIntl(nextConfig);