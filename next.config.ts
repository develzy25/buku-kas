import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["@fortawesome/free-solid-svg-icons", "sweetalert2"],
  },
};

export default nextConfig;
