import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.ignoreWarnings = [{ module: /@opentelemetry\/instrumentation/ }];
    }
    return config;
  },
  serverExternalPackages: ["@opentelemetry/instrumentation"],
};

export default nextConfig;
