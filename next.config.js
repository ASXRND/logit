/** @type {import('next').NextConfig} */
const nextConfig = {
  // Удалено experimental.allowedDevOrigins - больше не поддерживается
  async headers() {
    return [
      {
        // Применяем эти заголовки ко всем API-роутам
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { 
            key: "Access-Control-Allow-Origin", 
            value: [
            //   'http://localhost:3000',
            //   'http://192.168.0.102:3000',
              'https://8296-45-38-170-113.ngrok-free.app',
            ].join(',') 
          },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,PUT,DELETE,OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" }
        ]
      }
    ]
  },
  // Можно оставить другие экспериментальные флаги, если они актуальны
  experimental: {
    // serverActions: true, // пример актуальной экспериментальной функции
  }
}

module.exports = nextConfig



