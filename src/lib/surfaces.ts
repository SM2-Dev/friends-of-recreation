import type { Field } from 'payload'

export const surfaces = ['paper', 'tint', 'teal', 'field', 'flare', 'navy'] as const

export type Surface = (typeof surfaces)[number]

const darkSurfaces: Surface[] = ['teal', 'field', 'flare', 'navy']

export const surfaceOptions: Array<{ label: string; value: Surface }> = [
  { label: 'Paper', value: 'paper' },
  { label: 'Warm tint', value: 'tint' },
  { label: 'Teal', value: 'teal' },
  { label: 'Green field', value: 'field' },
  { label: 'Flare', value: 'flare' },
  { label: 'Navy', value: 'navy' },
]

export function isSurface(value: unknown): value is Surface {
  return typeof value === 'string' && (surfaces as readonly string[]).includes(value)
}

export function surfaceClass(value: unknown, fallback: Surface): string {
  const surface = isSurface(value) ? value : fallback
  const dark = darkSurfaces.includes(surface)
  return dark ? `surface-${surface} surface-dark` : `surface-${surface}`
}

export function surfaceField(defaultValue: Surface): Field {
  return {
    name: 'background',
    type: 'select',
    defaultValue,
    options: surfaceOptions,
    admin: {
      description:
        'Fill behind this section. Teal, green, flare, and navy switch the type to light ink so it stays readable.',
    },
  }
}
