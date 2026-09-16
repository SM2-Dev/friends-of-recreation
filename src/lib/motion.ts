import type { CSSProperties } from 'react'

/** Staggers a reveal or first-paint entrance without inlining magic strings. */
export function stagger(delayMs: number): CSSProperties {
  return {
    '--reveal-delay': `${delayMs}ms`,
    '--enter-delay': `${delayMs}ms`,
  } as CSSProperties
}
