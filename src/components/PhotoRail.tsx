'use client'

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react'

import { SiteImage } from '@/components/SiteImage'
import type { Media } from '@/payload-types'

type PhotoRailProps = {
  photos: Media[]
}

function wrap(index: number, length: number) {
  return ((index % length) + length) % length
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function Chevron({ direction }: { direction: 'prev' | 'next' }) {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path
        d={direction === 'prev' ? 'M14.5 5.5 8 12l6.5 6.5' : 'M9.5 5.5 16 12l-6.5 6.5'}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.25"
      />
    </svg>
  )
}

export function PhotoRail({ photos }: PhotoRailProps) {
  const labelId = useId()
  const statusId = useId()
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const slideRef = useRef<HTMLDivElement>(null)
  const indexRef = useRef(0)
  const offsetRef = useRef(0)
  const metricsRef = useRef({ step: 1, peek: 0 })
  const dragRef = useRef({
    pointerId: -1,
    startX: 0,
    startY: 0,
    origin: 0,
    lastX: 0,
    lastT: 0,
    velocity: 0,
    active: false,
    moved: false,
  })

  const count = photos.length
  const looping = count >= 3
  const [index, setIndex] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [interacted, setInteracted] = useState(false)
  const movingRef = useRef(false)
  const settleTimer = useRef(0)

  const slides = looping ? [...photos, ...photos, ...photos] : photos

  const measure = useCallback(() => {
    const viewport = viewportRef.current
    const slide = slideRef.current
    const track = trackRef.current
    if (!viewport || !slide || !track) return metricsRef.current

    const slideW = slide.getBoundingClientRect().width
    const gap = Number.parseFloat(getComputedStyle(track).gap) || 0
    metricsRef.current = {
      step: Math.max(1, slideW + gap),
      peek: (viewport.clientWidth - slideW) / 2,
    }
    return metricsRef.current
  }, [])

  const slotForIndex = useCallback(
    (logical: number) => (looping ? count + logical : logical),
    [count, looping],
  )

  const offsetForSlot = useCallback((slot: number) => {
    const { peek, step } = metricsRef.current
    return peek - slot * step
  }, [])

  const paint = useCallback((x: number, animate: boolean) => {
    const track = trackRef.current
    if (!track) return

    const from = offsetRef.current
    offsetRef.current = x

    if (animate && !prefersReducedMotion()) {
      track.style.transition = 'none'
      track.style.transform = `translate3d(${from}px, 0, 0)`
      void track.offsetWidth
      track.style.transition = 'transform 620ms cubic-bezier(0.22, 1, 0.36, 1)'
    } else {
      track.style.transition = 'none'
    }

    track.style.transform = `translate3d(${x}px, 0, 0)`
  }, [])

  const commitIndex = useCallback(
    (logical: number) => {
      const next = wrap(logical, count)
      indexRef.current = next
      setIndex(next)
    },
    [count],
  )

  const finishMove = useCallback(() => {
    window.clearTimeout(settleTimer.current)
    movingRef.current = false
    if (!looping) return
    paint(offsetForSlot(slotForIndex(indexRef.current)), false)
  }, [looping, offsetForSlot, paint, slotForIndex])

  const animateToSlot = useCallback(
    (slot: number, logical: number) => {
      const target = offsetForSlot(slot)
      commitIndex(logical)
      window.clearTimeout(settleTimer.current)

      if (prefersReducedMotion() || Math.abs(target - offsetRef.current) < 0.5) {
        movingRef.current = false
        paint(offsetForSlot(slotForIndex(wrap(logical, count))), false)
        return
      }

      movingRef.current = true
      paint(target, true)
      settleTimer.current = window.setTimeout(() => {
        if (movingRef.current) finishMove()
      }, 700)
    },
    [commitIndex, count, finishMove, offsetForSlot, paint, slotForIndex],
  )

  const go = useCallback(
    (direction: -1 | 1) => {
      if (count < 2 || dragRef.current.active) return
      setInteracted(true)
      measure()

      const { peek, step } = metricsRef.current
      let currentSlot = Math.round((peek - offsetRef.current) / step)

      if (looping && (currentSlot < count || currentSlot >= count * 2)) {
        currentSlot = slotForIndex(wrap(currentSlot, count))
        paint(offsetForSlot(currentSlot), false)
      }

      if (!looping) {
        const next = Math.min(count - 1, Math.max(0, currentSlot + direction))
        if (next === currentSlot) return
        animateToSlot(next, next)
        return
      }

      animateToSlot(currentSlot + direction, currentSlot + direction)
    },
    [animateToSlot, count, looping, measure, offsetForSlot, paint, slotForIndex],
  )

  useLayoutEffect(() => {
    const sync = () => {
      measure()
      if (dragRef.current.active || movingRef.current) return
      paint(offsetForSlot(slotForIndex(indexRef.current)), false)
    }

    sync()
    const viewport = viewportRef.current
    if (!viewport) return

    const observer = new ResizeObserver(sync)
    observer.observe(viewport)
    return () => observer.disconnect()
  }, [count, measure, offsetForSlot, paint, slotForIndex])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const onEnd = (event: TransitionEvent) => {
      if (event.target !== track || event.propertyName !== 'transform') return
      if (!movingRef.current) return
      finishMove()
    }

    track.addEventListener('transitionend', onEnd)
    return () => track.removeEventListener('transitionend', onEnd)
  }, [count, finishMove])

  if (count === 0) return null

  const atStart = !looping && index === 0
  const atEnd = !looping && index === count - 1

  const release = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    if (!drag.active || drag.pointerId !== event.pointerId) return

    drag.active = false
    setDragging(false)
    try {
      event.currentTarget.releasePointerCapture(event.pointerId)
    } catch {
      // Capture can already be released on cancel.
    }

    if (!drag.moved) return

    setInteracted(true)
    if (performance.now() - drag.lastT > 80) drag.velocity = 0

    measure()
    const { peek, step } = metricsRef.current
    const projected = offsetRef.current + drag.velocity * 240
    let slot = Math.round((peek - projected) / step)

    if (!looping) {
      slot = Math.min(count - 1, Math.max(0, slot))
    } else {
      slot = Math.min(slides.length - 1, Math.max(0, slot))
    }

    animateToSlot(slot, wrap(slot, count))
  }

  return (
    <div
      aria-labelledby={labelId}
      aria-roledescription="carousel"
      className={
        count === 1
          ? 'photo-rail photo-rail-single'
          : dragging
            ? 'photo-rail is-dragging'
            : 'photo-rail'
      }
      data-mode={looping ? 'loop' : 'strip'}
      data-plate=""
      role="region"
    >
      <div aria-hidden="true" className="plate-fill" />
      <p className="visually-hidden" id={labelId}>
        Photographs of recreation in Saratoga Springs
      </p>
      <p aria-atomic="true" aria-live="polite" className="visually-hidden" id={statusId}>
        {interacted ? (
          <>
            Photograph {index + 1} of {count}
            {photos[index]?.alt ? `: ${photos[index].alt}` : ''}
          </>
        ) : null}
      </p>

      <div
        className="photo-rail-viewport"
        onDragStart={(event) => event.preventDefault()}
        onPointerCancel={release}
        onPointerDown={(event) => {
          if (count < 2) return
          if (event.pointerType === 'mouse' && event.button !== 0) return

          measure()
          dragRef.current = {
            pointerId: event.pointerId,
            startX: event.clientX,
            startY: event.clientY,
            origin: offsetRef.current,
            lastX: event.clientX,
            lastT: performance.now(),
            velocity: 0,
            active: true,
            moved: false,
          }
          movingRef.current = false
          setDragging(true)
          paint(offsetRef.current, false)
          try {
            event.currentTarget.setPointerCapture(event.pointerId)
          } catch {
            // Untrusted or synthetic pointers can skip capture; move handlers still track while over the rail.
          }
        }}
        onPointerMove={(event) => {
          const drag = dragRef.current
          if (!drag.active || drag.pointerId !== event.pointerId) return

          const dx = event.clientX - drag.startX
          const dy = event.clientY - drag.startY

          if (!drag.moved && Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 8) {
            drag.active = false
            setDragging(false)
            try {
              event.currentTarget.releasePointerCapture(event.pointerId)
            } catch {
              // Already released.
            }
            paint(offsetForSlot(slotForIndex(indexRef.current)), true)
            return
          }

          if (Math.abs(dx) > 2) drag.moved = true

          const now = performance.now()
          const elapsed = now - drag.lastT
          if (elapsed > 12 && elapsed < 64) {
            const velocity = (event.clientX - drag.lastX) / elapsed
            drag.velocity = Math.max(-1.6, Math.min(1.6, velocity))
          } else if (elapsed >= 64) {
            drag.velocity = 0
          }
          drag.lastX = event.clientX
          drag.lastT = now

          let next = drag.origin + dx
          if (!looping) {
            const max = metricsRef.current.peek
            const min = metricsRef.current.peek - (count - 1) * metricsRef.current.step
            if (next > max) next = max + (next - max) * 0.28
            if (next < min) next = min + (next - min) * 0.28
          }

          paint(next, false)
        }}
        onPointerUp={release}
        ref={viewportRef}
      >
        <div className="photo-rail-track" ref={trackRef}>
          {slides.map((photo, slot) => {
            const logical = wrap(slot, count)
            const current = logical === index && (!looping || slot === count + index)
            return (
              <div
                aria-hidden={current ? undefined : true}
                className="photo-rail-slide"
                key={`${photo.id}-${slot}`}
                ref={slot === 0 ? slideRef : undefined}
              >
                <SiteImage
                  className="photo-rail-photo"
                  hideWhenEmpty
                  media={photo}
                  sizes="(min-width: 52rem) 67vw, 78vw"
                />
              </div>
            )
          })}
        </div>
      </div>

      {count > 1 ? (
        <div
          className="photo-rail-nav"
          onKeyDown={(event) => {
            if (event.key === 'ArrowLeft') {
              event.preventDefault()
              go(-1)
            }
            if (event.key === 'ArrowRight') {
              event.preventDefault()
              go(1)
            }
          }}
        >
          <button
            aria-controls={statusId}
            aria-label="Previous photograph"
            className="photo-rail-btn"
            disabled={atStart}
            onClick={() => go(-1)}
            type="button"
          >
            <Chevron direction="prev" />
          </button>
          <button
            aria-controls={statusId}
            aria-label="Next photograph"
            className="photo-rail-btn"
            disabled={atEnd}
            onClick={() => go(1)}
            type="button"
          >
            <Chevron direction="next" />
          </button>
        </div>
      ) : null}
    </div>
  )
}
