import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Local MinIO development
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9000',
        pathname: '/openvtt/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '9000',
        pathname: '/openvtt/**',
      },
      // Add production S3/MinIO domains here when needed
      // {
      //   protocol: 'https',
      //   hostname: 'your-s3-bucket.s3.amazonaws.com',
      // },
    ],
  },
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
};

export default nextConfig;
