'use client'

import { useEffect } from 'react'

const LIVE_SCROLL_KEY = 'impeccable-live-session-scroll'

function pinTop() {
  if (window.location.hash) return
  window.scrollTo({ left: 0, top: 0, behavior: 'instant' })
}

/**
 * The homepage must open at the top. Browser restoration, image-load
 * anchoring, and leftover Live sessions have all been sliding the
 * viewport down to the photo rail on reload.
 */
export function NoAutoScroll() {
  useEffect(() => {
    try {
      history.scrollRestoration = 'manual'
    } catch {
      // Older browsers can ignore this.
    }
    try {
      localStorage.removeItem(LIVE_SCROLL_KEY)
    } catch {
      // Private mode can block storage.
    }

    if (window.location.hash) return

    let armed = true
    const hold = () => {
      if (armed) pinTop()
    }

    hold()
    document.fonts?.ready.then(hold).catch(() => {})
    window.addEventListener('load', hold)
    window.addEventListener('scroll', hold, { passive: true })

    const frames = window.setInterval(hold, 50)
    const releaseTimer = window.setTimeout(release, 2000)

    function release() {
      if (!armed) return
      armed = false
      window.clearInterval(frames)
      window.clearTimeout(releaseTimer)
      window.removeEventListener('load', hold)
      window.removeEventListener('scroll', hold)
    }

    const onUser = () => release()
    window.addEventListener('wheel', onUser, { passive: true, once: true })
    window.addEventListener('touchstart', onUser, { passive: true, once: true })
    window.addEventListener('pointerdown', onUser, { once: true })
    window.addEventListener('keydown', onUser, { once: true })

    return () => {
      armed = false
      window.clearInterval(frames)
      window.clearTimeout(releaseTimer)
      window.removeEventListener('load', hold)
      window.removeEventListener('scroll', hold)
      window.removeEventListener('wheel', onUser)
      window.removeEventListener('touchstart', onUser)
      window.removeEventListener('pointerdown', onUser)
      window.removeEventListener('keydown', onUser)
    }
  }, [])

  return null
}
