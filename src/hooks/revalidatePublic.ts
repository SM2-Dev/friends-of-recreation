import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from 'payload'

async function revalidatePublicCache() {
  try {
    const { revalidatePath } = await import('next/cache')
    revalidatePath('/', 'layout')
    revalidatePath('/sitemap.xml')
    revalidatePath('/robots.txt')
  } catch {
    // Payload CLI, seed, and tests run outside the Next.js request cache.
  }
}

export const revalidateAfterChange: CollectionAfterChangeHook = async () => {
  await revalidatePublicCache()
}

export const revalidateAfterDelete: CollectionAfterDeleteHook = async () => {
  await revalidatePublicCache()
}

export const revalidateAfterGlobalChange: GlobalAfterChangeHook = async () => {
  await revalidatePublicCache()
}
