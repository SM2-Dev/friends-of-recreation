import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type ContainerProps = {
  children: ReactNode
  width?: 'narrow' | 'wide' | 'full'
  className?: string
  as?: 'div' | 'section' | 'header' | 'footer' | 'article'
}

export function Container({ children, width = 'wide', className, as: Tag = 'div' }: ContainerProps) {
  return <Tag className={cn('container', `container-${width}`, className)}>{children}</Tag>
}
