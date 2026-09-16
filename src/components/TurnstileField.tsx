'use client'

import { useEffect, useId, useRef } from 'react'

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

type TurnstileApi = {
  render: (element: HTMLElement, options: { sitekey: string; theme?: string }) => string
  reset: (widgetId: string) => void
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}

type TurnstileFieldProps = {
  resetSignal?: string
}

export function TurnstileField({ resetSignal }: TurnstileFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetId = useRef<string | null>(null)
  const labelId = useId()

  useEffect(() => {
    if (!SITE_KEY) return undefined

    const renderWidget = () => {
      const api = window.turnstile
      const container = containerRef.current
      if (!api || !container) return

      if (widgetId.current) {
        api.reset(widgetId.current)
        return
      }

      widgetId.current = api.render(container, { sitekey: SITE_KEY, theme: 'light' })
    }

    const existing = document.getElementById('cf-turnstile-script') as HTMLScriptElement | null
    if (window.turnstile) {
      renderWidget()
      return undefined
    }

    const script =
      existing ??
      Object.assign(document.createElement('script'), {
        id: 'cf-turnstile-script',
        src: 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit',
        async: true,
      })

    script.addEventListener('load', renderWidget)
    if (!existing) document.head.appendChild(script)

    return () => {
      script.removeEventListener('load', renderWidget)
    }
  }, [resetSignal])

  if (!SITE_KEY) return null

  return (
    <div className="form-field">
      <p className="visually-hidden" id={labelId}>
        Spam protection
      </p>
      <div aria-labelledby={labelId} ref={containerRef} />
    </div>
  )
}
