import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use project root for output file tracing (fixes monorepo/multiple lockfile warning on Vercel)
  outputFileTracingRoot: process.cwd(),
};

export default nextConfig;
