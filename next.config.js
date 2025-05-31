const os = require('os');

function getLocalIp() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // ищем IPv4, не internal (не локальный loopback)
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return 'localhost'; // если не нашли — fallback
}

const localIp = getLocalIp();

const nextConfig = {
  experimental: {
    allowedDevOrigins: [`http://${localIp}:3000`],
  },
};

module.exports = nextConfig;
