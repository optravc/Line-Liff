/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['overstiff-patience-unmeticulously.ngrok-free.dev'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn-icons-png.flaticon.com', 
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'profile.line-scdn.net', 
        port: '',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig