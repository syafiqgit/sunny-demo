import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // The stage layers are zoomed by the camera transform, so they are
    // requested above their natural CSS size - keep the high qualities the
    // components ask for instead of silently falling back to 75.
    qualities: [75, 90, 95, 100],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
