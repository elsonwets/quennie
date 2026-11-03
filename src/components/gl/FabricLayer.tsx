import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '~/hooks/useReducedMotion'

/**
 * Mounts the site-wide cloth layer once. Phones and reduced-motion visitors keep the plain
 * images: the effect is decoration, never content.
 */
export function FabricLayer() {
  const canvas = useRef<HTMLCanvasElement>(null)
  const reduce = useReducedMotion()
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const wide = window.matchMedia('(min-width: 768px)')
    const update = () => setEnabled(wide.matches)
    update()
    wide.addEventListener('change', update)
    return () => wide.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (!enabled || reduce || !canvas.current) return
    let disposed = false
    let engine: { dispose: () => void } | undefined
    const element = canvas.current
    const lost = (e: Event) => {
      e.preventDefault()
      engine?.dispose()
    }
    element.addEventListener('webglcontextlost', lost)
    import('./FabricImages')
      .then(({ FabricImages }) => {
        if (!disposed) engine = new FabricImages(element)
      })
      .catch(() => {})
    return () => {
      disposed = true
      element.removeEventListener('webglcontextlost', lost)
      engine?.dispose()
    }
  }, [enabled, reduce])

  if (!enabled || reduce) return null
  return <canvas ref={canvas} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[10] h-svh w-full" />
}
