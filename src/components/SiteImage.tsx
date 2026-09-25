import Image from 'next/image'

import type { Media } from '@/payload-types'
import { imageAltText } from '@/lib/mediaAlt'
import { cn, isMedia, toNextImageSrc } from '@/lib/utils'

type SiteImageProps = {
  media: unknown
  className?: string
  sizes: string
  priority?: boolean
  objectPosition?: string | null
  /** Logos need the whole mark. Photographs crop. */
  fit?: 'cover' | 'contain'
  /** Decorative slots render nothing rather than an apology when no photo exists. */
  hideWhenEmpty?: boolean
  emptyLabel?: string
  /** Force empty alt when adjacent text already names the image, such as organization logos. */
  decorative?: boolean
}

const DEFAULT_EMPTY = 'Photography pending. Authentic Saratoga Springs recreation photos appear here.'

export function SiteImage({
  media,
  className,
  sizes,
  priority,
  objectPosition,
  fit = 'cover',
  hideWhenEmpty,
  emptyLabel = DEFAULT_EMPTY,
  decorative = false,
}: SiteImageProps) {
  const image = isMedia(media) && media.url ? (media as Media) : null

  if (!image?.url) {
    if (hideWhenEmpty) return null
    return (
      <div className={cn('site-image-empty', className)}>
        <p>{emptyLabel}</p>
      </div>
    )
  }

  return (
    <div className={cn('site-image-frame', fit === 'contain' && 'site-image-frame-contain', className)}>
      <Image
        alt={imageAltText(image, decorative)}
        className={cn('site-image', fit === 'contain' && 'site-image-contain')}
        fill
        priority={priority}
        sizes={sizes}
        src={toNextImageSrc(image.url)}
        style={objectPosition ? { objectPosition } : undefined}
      />
    </div>
  )
}
