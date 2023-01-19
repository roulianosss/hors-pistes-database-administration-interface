/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  env: {
    BACKEND_URL: 'https://hors-pistes-backend.vercel.app',
  },
}

module.exports = nextConfig
