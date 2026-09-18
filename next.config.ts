import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)
const payloadClientConfig = './src/payload/getClientConfig.ts'

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
    ],
  },
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      ],
    },
  ],
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }
    webpackConfig.resolve.alias = {
      ...webpackConfig.resolve.alias,
      '@payloadcms/ui/utilities/getClientConfig': path.resolve(dirname, 'src/payload/getClientConfig.ts'),
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
    resolveAlias: {
      '@tailwindcss/postcss': path.resolve(dirname, 'node_modules/@tailwindcss/postcss'),
      '@payloadcms/ui/utilities/getClientConfig': payloadClientConfig,
    },
  },
  agentRules: false,
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
