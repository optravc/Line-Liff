import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["cdn-icons-png.flaticon.com", "profile.line-scdn.net"],
  },
  allowedDevOrigins: ["overstiff-patience-unmeticulously.ngrok-free.dev"],
};

export default nextConfig;
