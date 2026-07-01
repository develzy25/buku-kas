import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

initOpenNextCloudflareForDev();

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["@fortawesome/free-solid-svg-icons", "sweetalert2"],
  },
};

export default nextConfig;

