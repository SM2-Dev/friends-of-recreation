import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
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

export default buildConfig({
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
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins: [],
  onInit: async (payload) => {
    const pages = await payload.find({
      collection: 'pages',
      limit: 1,
      overrideAccess: true,
      pagination: false,
    })

    if (pages.docs.length === 0) {
      await seedDevelopmentContent(payload)
    }
  },
})
