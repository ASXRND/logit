/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    allowedDevOrigins: [
      'http://192.168.0.103:3000',
      'https://5518-45-38-170-113.ngrok-free.app', // добавлен актуальный ngrok-домен
    ],
  },
  async rewrites() {
    return [
      {
        // Прокси для всего, кроме /api/auth
        source: '/api/:path((?!auth).*)',
        destination: 'https://7d3a-45-38-170-113.ngrok-free.app/:path*',
      },
    ]
  },
}

module.exports = nextConfig
