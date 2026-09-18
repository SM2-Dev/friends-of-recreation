'use client'

import { useLayoutEffect, useRef } from 'react'

import { formatPlainAmount, parsePlainAmount } from '@/lib/display'

const DURATION = 1100

function easeOut(t: number) {
  return 1 - (1 - t) ** 3
}

type CountUpAmountProps = {
  value: string
}

/**
 * Counts a published dollar figure up once its reveal host crosses into view.
 * Quiet / non-numeric labels pass through unchanged. The real amount stays in
 * a visually hidden span so assistive tech never hears the ticking digits.
 */
export function CountUpAmount({ value }: CountUpAmountProps) {
  const visualRef = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    const visual = visualRef.current
    const amount = parsePlainAmount(value)
    if (!visual || !amount) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const host = visual.closest('[data-reveal]')
    let frame = 0
    let started = false

    const run = () => {
      if (started) return
      started = true
      visual.textContent = formatPlainAmount(amount, 0)
      const origin = performance.now()

      const tick = (now: number) => {
        const t = Math.min(1, (now - origin) / DURATION)
        visual.textContent =
          t >= 1 ? value.trim() : formatPlainAmount(amount, amount.value * easeOut(t))
        if (t < 1) frame = requestAnimationFrame(tick)
      }

      frame = requestAnimationFrame(tick)
    }

    if (!host || host.getAttribute('data-reveal') === 'in') {
      run()
    } else {
      visual.textContent = formatPlainAmount(amount, 0)
    }

    const mutations = host
      ? new MutationObserver(() => {
          if (host.getAttribute('data-reveal') === 'in') run()
        })
      : null
    if (host) mutations?.observe(host, { attributes: true, attributeFilter: ['data-reveal'] })

    return () => {
      mutations?.disconnect()
      if (frame) cancelAnimationFrame(frame)
    }
  }, [value])

  if (!parsePlainAmount(value)) return value

  return (
    <>
      <span className="visually-hidden">{value}</span>
      <span aria-hidden="true" ref={visualRef}>
        {value}
      </span>
    </>
  )
}
