import type { NextConfig } from "next";

// Applied to every response. None of these need a nonce, so they cost nothing
// at runtime and cannot break the inline styles/scripts Next emits:
// the CSP here only pins the framing/base/form vectors rather than trying to
// lock down script-src, which would need a nonce pipeline.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Content-Security-Policy",
    value: "frame-ancestors 'self'; base-uri 'self'; form-action 'self'",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  // Nothing gained by advertising the framework version.
  poweredByHeader: false,
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
  headers() {
    return Promise.resolve([{ source: "/:path*", headers: securityHeaders }]);
  },
};

export default nextConfig;
