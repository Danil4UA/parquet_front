import createNextIntlPlugin from "next-intl/plugin";
import { RemotePattern } from "next/dist/shared/lib/image-config";

const withNextIntl = createNextIntlPlugin();

const remotePatterns: RemotePattern[] = [
  {
    protocol: "https",
    hostname: "firebasestorage.googleapis.com"
  }
];
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: { remotePatterns },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  webpack(config: any) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"]
    });
    return config;
  }
};

export default withNextIntl(nextConfig);
