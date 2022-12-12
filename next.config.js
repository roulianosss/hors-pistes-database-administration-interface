/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  env: {
    BACKEND_URL: 'http://localhost:3000',
  },
}

module.exports = nextConfig
