import { postgresAdapter } from '@payloadcms/db-postgres'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { pushDevSchema } from '@payloadcms/drizzle'
import type { DrizzleAdapter } from '@payloadcms/drizzle'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { BoardMembers } from './collections/BoardMembers'
import { ContactSubmissions } from './collections/ContactSubmissions'
import { Events } from './collections/Events'
import { GrantRequests } from './collections/GrantRequests'
import { Media } from './collections/Media'
import { Organizations } from './collections/Organizations'
import { Pages } from './collections/Pages'
import { Projects } from './collections/Projects'
import { Users } from './collections/Users'
import { SiteSettings } from './globals/SiteSettings'
import { seedDevelopmentContent } from './seed/development'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

function isLocalDatabaseHost(hostname: string) {
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1'
}

function rawPostgresUrl() {
  if (process.env.NODE_ENV === 'production') {
    return process.env.POSTGRES_URL || process.env.DATABASE_URL || ''
  }

  return process.env.DATABASE_URL || process.env.POSTGRES_URL || ''
}

function postgresPoolConfig() {
  const raw = rawPostgresUrl()
  if (!raw) return { connectionString: '' }

  try {
    const url = new URL(raw)
    // Neon adds channel_binding=require. Payload's pg driver cannot do
    // SCRAM-SHA-256-PLUS, so every login fails until that param is removed.
    url.searchParams.delete('channel_binding')

    if (isLocalDatabaseHost(url.hostname)) {
      url.searchParams.delete('sslmode')
      return { connectionString: url.toString(), ssl: false as const }
    }

    if (!url.searchParams.has('sslmode')) url.searchParams.set('sslmode', 'require')
    // The pooler cannot run Payload's schema push. Use the direct host on Neon.
    if (url.hostname.includes('-pooler.')) {
      url.hostname = url.hostname.replace('-pooler.', '.')
    }
    return {
      connectionString: url.toString(),
      ssl: { rejectUnauthorized: false },
    }
  } catch {
    return { connectionString: raw }
  }
}

const { connectionString: databaseUrl, ssl: postgresSsl } = postgresPoolConfig()
const blobToken = process.env.BLOB_READ_WRITE_TOKEN
const publicServerUrl = (process.env.NEXT_PUBLIC_SERVER_URL || process.env.PAYLOAD_PUBLIC_SERVER_URL || '').replace(
  /\/$/,
  '',
)

export default buildConfig({
  ...(publicServerUrl ? { serverURL: publicServerUrl } : {}),
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' · Friends of Recreation',
    },
  },
  collections: [
    Users,
    Media,
    BoardMembers,
    Events,
    Projects,
    Organizations,
    Pages,
    ContactSubmissions,
    GrantRequests,
  ],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: databaseUrl,
      ...(postgresSsl === undefined ? {} : { ssl: postgresSsl }),
    },
    // Adapter push is ignored when NODE_ENV=production (Vercel). onInit pushes instead.
    push: false,
  }),
  sharp,
  plugins: [
    vercelBlobStorage({
      enabled: Boolean(blobToken),
      collections: {
        media: true,
      },
      token: blobToken,
      clientUploads: true,
    }),
  ],
  onInit: async (payload) => {
    try {
      if (process.env.PAYLOAD_PUSH_SCHEMA !== 'false') {
        await pushDevSchema(payload.db as unknown as DrizzleAdapter)
      }
    } catch (error) {
      payload.logger.error({ err: error }, 'Database schema was not created')
    }

    try {
      const pages = await payload.find({
        collection: 'pages',
        limit: 1,
        overrideAccess: true,
        pagination: false,
      })

      if (pages.docs.length === 0) {
        await seedDevelopmentContent(payload)
      }
    } catch (error) {
      payload.logger.error({ err: error }, 'Starter content was not created during startup')
    }
  },
})
