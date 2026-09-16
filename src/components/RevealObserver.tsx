'use client'

import { useEffect } from 'react'

/**
 * Two scroll jobs, one frame:
 *  1. Flip `data-reveal="idle"` to `"in"` once it crosses the reveal line.
 *  2. Drive `--plate-open` on `[data-plate]` so only the colored fill
 *     expands to the viewport, then pinches back as the next section arrives.
 *
 * Content is visible without this script (see the layout `<noscript>` rule).
 */
export function RevealObserver() {
  useEffect(() => {
    const settle = (element: Element) => element.setAttribute('data-reveal', 'in')
    const pending = () => document.querySelectorAll('[data-reveal="idle"]')
    const plates = () => document.querySelectorAll<HTMLElement>('[data-plate]')

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      pending().forEach(settle)
      plates().forEach((plate) => {
        plate.style.setProperty('--plate-open', '1')
      })
      return
    }

    let frame = 0

    const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

    const openPlate = (element: HTMLElement) => {
      const view = window.innerHeight
      const rect = element.getBoundingClientRect()
      const hold = element.getAttribute('data-plate') === 'hold'
      const enterStart = view * (hold ? 0.5 : 0.94)
      const enterEnd = view * (hold ? 0.12 : 0.2)
      const enter = clamp01((enterStart - rect.top) / (enterStart - enterEnd))
      const exitStart = view * 0.92
      const exitEnd = view * 0.4
      const leave = clamp01((rect.bottom - exitEnd) / (exitStart - exitEnd))
      const t = Math.min(enter, leave)
      const eased = 1 - (1 - t) * (1 - t)
      element.style.setProperty('--plate-open', eased.toFixed(4))
    }

    // Settling by measured position rather than by intersection events matters:
    // an element that jumps from below the fold to above it — an anchor link, a
    // restored scroll offset, a fast flick — never fires an intersection change,
    // and would otherwise stay stranded at opacity 0 forever.
    const sweep = () => {
      frame = 0
      const line = window.innerHeight * 0.88
      pending().forEach((element) => {
        if (element.getBoundingClientRect().top < line) settle(element)
      })
      plates().forEach(openPlate)
    }

    const schedule = () => {
      if (frame) return
      frame = requestAnimationFrame(sweep)
    }

    sweep()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)

    const mutations = new MutationObserver(schedule)
    mutations.observe(document.body, { childList: true, subtree: true })

    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      mutations.disconnect()
    }
  }, [])

  return null
}
