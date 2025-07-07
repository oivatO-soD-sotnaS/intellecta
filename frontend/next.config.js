/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: { appDir: true },
  async rewrites() {
    return [
      {
        source: "/api/files/:path*",
        // chama diretamente o container na porta 80
        destination: "http://files.intellecta/users/avatar/:path*",
      },
    ]
  },
}

module.exports = nextConfig
