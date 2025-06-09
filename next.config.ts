import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    unoptimized: true,
  },
  /* PPR is experimental */
  //  experimental: {
  //  ppr: "incremental"
  // }
};

export default nextConfig;
