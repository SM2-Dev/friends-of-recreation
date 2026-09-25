import { createClientConfig } from 'payload'
import { cache } from 'react'

type GetClientConfigArgs = {
  config: Parameters<typeof createClientConfig>[0]['config']
  i18n: Parameters<typeof createClientConfig>[0]['i18n']
  importMap: Parameters<typeof createClientConfig>[0]['importMap']
  user?: Parameters<typeof createClientConfig>[0]['user']
}

const globalCache = globalThis as typeof globalThis & {
  _payload_clientConfigs?: Record<string, ReturnType<typeof createClientConfig>>
  _payload_doNotCacheClientConfig?: boolean
}

let cachedClientConfigs = globalCache._payload_clientConfigs
if (!cachedClientConfigs) {
  cachedClientConfigs = globalCache._payload_clientConfigs = {}
}

/**
 * Payload 3.89 strips theme/toast/auth settings for logged-out admin routes.
 * Next.js 16 then renders those routes as a blank page. Always return the
 * full client config so /admin/login and create-first-user paint.
 */
export const getClientConfig = cache(({ config, i18n, importMap }: GetClientConfigArgs) => {
  const currentLanguage = i18n.language

  if (cachedClientConfigs![currentLanguage] && !globalCache._payload_doNotCacheClientConfig) {
    return cachedClientConfigs![currentLanguage]
  }

  const clientConfig = createClientConfig({
    config,
    i18n,
    importMap,
    user: true,
  })

  cachedClientConfigs![currentLanguage] = clientConfig
  globalCache._payload_clientConfigs = cachedClientConfigs
  globalCache._payload_doNotCacheClientConfig = false

  return clientConfig
})
