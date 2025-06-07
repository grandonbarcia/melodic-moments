import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  images: {
    remotePatterns: [new URL('https://cdn.pixabay.com/**')],
  },
  async rewrites() {
    return [
      {
        source: '/',
        destination: 'https://melodic-moments.s3.us-east-2.amazonaws.com/**',
      },
    ];
  },
};

export default nextConfig;
