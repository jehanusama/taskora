import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack (default in Next 16) crashes on Windows with a PostCSS worker
  // process exit (exit code 0, no output). Use webpack via the build script
  // until this is fixed upstream in Turbopack.
  async redirects() {
    return [
      {
        source: "/dashboard",
        destination: "/acme/dashboard",
        permanent: false,
      },
      {
        source: "/projects",
        destination: "/acme/projects",
        permanent: false,
      },
      {
        source: "/members",
        destination: "/acme/members",
        permanent: false,
      },
      {
        source: "/settings",
        destination: "/acme/settings",
        permanent: false,
      },
      {
        source: "/kanban",
        destination: "/acme/projects",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
