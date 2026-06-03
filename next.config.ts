import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A parent lockfile exists higher up the tree; pin the workspace root here.
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
