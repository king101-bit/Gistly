import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wvxxjkbneuosvlbgojyj.supabase.co',
      },
    ],
  },
}

export default nextConfig
