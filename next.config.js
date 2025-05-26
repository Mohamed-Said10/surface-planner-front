/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true 
  },

  async rewrites() {
    const isDevelopment = process.env.NODE_ENV === 'development';
    const apiBaseUrl = isDevelopment 
      ? 'http://localhost:3000' 
      : process.env.NEXT_PUBLIC_API_URL || 'https://planner-back-end-six.vercel.app';

    return [
      {
        source: "/api/:path*",
        destination: `${apiBaseUrl}/api/:path*`,
      },
    ];
  },

  async headers() {
    const allowedOrigin = process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://sp-dashboard-nine.vercel.app';

    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: allowedOrigin },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,PUT,DELETE,OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;