import Image from 'next/image'

import type { Media } from '@/payload-types'
import { cn, isMedia } from '@/lib/utils'

type SiteImageProps = {
  media: unknown
  className?: string
  sizes: string
  priority?: boolean
  objectPosition?: string | null
}

export function SiteImage({ media, className, sizes, priority, objectPosition }: SiteImageProps) {
  if (!isMedia(media) || !media.url) {
    return (
      <div className={cn('site-image-empty', className)}>
        <p>Photography pending. Authentic Saratoga Springs recreation photos will appear here.</p>
      </div>
    )
  }

  const image = media as Media
  const src = image.url

  if (!src) {
    return (
      <div className={cn('site-image-empty', className)}>
        <p>Photography pending. Authentic Saratoga Springs recreation photos will appear here.</p>
      </div>
    )
  }

  return (
    <div className={cn('site-image-frame', className)}>
      <Image
        alt={image.alt}
        className="site-image"
        fill
        priority={priority}
        sizes={sizes}
        src={src}
        style={objectPosition ? { objectPosition } : undefined}
      />
    </div>
  )
}
