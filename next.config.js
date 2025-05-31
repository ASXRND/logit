/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => [
    {
      source: '/api/:path*',
      destination: 'https://7d3a-45-38-170-113.ngrok-free.app/:path*',
    },
  ],
};

module.exports = nextConfig;