/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "files.intellecta",
        port: "8080",
        pathname: "/**",
      },
    ],
  },
}

module.exports = nextConfig;
