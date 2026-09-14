import 'dotenv/config'
import { getPayload } from 'payload'

import config from '@payload-config'
import { seedDevelopmentContent } from './development'

const payload = await getPayload({ config })
await seedDevelopmentContent(payload)
process.exit(0)
