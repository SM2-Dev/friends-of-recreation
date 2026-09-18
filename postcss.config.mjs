import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const require = createRequire(fileURLToPath(import.meta.url))
const tailwindcss = require('@tailwindcss/postcss')

const config = {
  plugins: [tailwindcss],
}

export default config
