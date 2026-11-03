import { useRouterState } from '@tanstack/react-router'
import Lenis from 'lenis'
import { useEffect, useRef } from 'react'

let lenis: Lenis | null = null

export function scrollToTarget(target: string | number) {
  if (lenis) lenis.scrollTo(target, { offset: -24 })
  else if (typeof target === 'number') window.scrollTo(0, target)
  else document.querySelector(target)?.scrollIntoView()
}

/** Inertial scrolling. Native scroll position is kept, so motion's useScroll keeps working. */
export function SmoothScroll() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const hash = useRouterState({ select: (s) => s.location.hash })
  const first = useRef(true)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9, anchors: { offset: -24 } })
    let raf = requestAnimationFrame(function tick(time) {
      lenis?.raf(time)
      raf = requestAnimationFrame(tick)
    })
    return () => {
      cancelAnimationFrame(raf)
      lenis?.destroy()
      lenis = null
    }
  }, [])

  // Route changes start at the top, or at the requested section.
  useEffect(() => {
    if (first.current) {
      first.current = false
      if (!hash) return
    }
    // Give pinned sections and images a moment to settle their height before measuring.
    if (hash) window.setTimeout(() => scrollToTarget(`#${hash}`), 350)
    else lenis?.scrollTo(0, { immediate: true })
  }, [pathname, hash])

  return null
}
