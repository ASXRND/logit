/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => [
    {
      // Не проксируем /api/auth/*, чтобы NextAuth работал локально
      source: '/api/:path((?!auth).*)',
      destination: 'https://7d3a-45-38-170-113.ngrok-free.app/:path*',
    },
  ],
  allowedDevOrigins: ["192.168.0.103"],
};

module.exports = nextConfig;