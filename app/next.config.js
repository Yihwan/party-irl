/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,  
  typescript: {
    ignoreBuildErrors: true,
  },
  distDir: 'build',
};

module.exports = nextConfig;
