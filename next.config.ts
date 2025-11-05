import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    unoptimized: true,
    remotePatterns: [{ hostname: "*.public.blob.vercel-storage.com" }],
  },
  /* PPR is experimental */
  //  experimental: {
  //  ppr: "incremental"
  // }
};

export default nextConfig;
