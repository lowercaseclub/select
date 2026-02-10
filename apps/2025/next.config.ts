import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  serverExternalPackages: ["sharp"],
  async redirects() {
    return [
      {
        source: "/second-chance",
        destination:
          "https://docs.google.com/forms/d/e/1FAIpQLScerp9XhRfDXIl3fDUiFcbTfdVrgbbVSbh2NKrZ-tnXaNcFng/viewform",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
