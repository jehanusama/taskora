import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack (default in Next 16) crashes on Windows with a PostCSS worker
  // process exit (exit code 0, no output). Use webpack via the build script
  // until this is fixed upstream in Turbopack.
};

export default nextConfig;
