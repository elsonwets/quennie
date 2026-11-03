import { useReducedMotion } from '~/hooks/useReducedMotion'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import type { PhotographicCurtainScene } from './PhotographicCurtainScene'

export function PhotographicCurtain({ onOpened }: { onOpened: () => void }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const callback = useRef(onOpened)
  callback.current = onOpened
  const reduce = useReducedMotion()
  const [ready, setReady] = useState(false)
  const [fallback, setFallback] = useState(false)

  useEffect(() => {
    if (reduce) { callback.current(); return }
    let disposed = false
    let failed = false
    let scene: PhotographicCurtainScene | undefined
    const fail = () => { if (!disposed) { failed = true; scene?.dispose(); setReady(false); setFallback(true) } }
    const timeout = window.setTimeout(fail, 7000)
    const lost = (event: Event) => { event.preventDefault(); fail() }
    const element = canvas.current
    element?.addEventListener('webglcontextlost', lost)
    async function start() {
      try {
        const room = new Image()
        room.src = '/images/hero-interior.jpg'
        const [{ PhotographicCurtainScene }] = await Promise.all([import('./PhotographicCurtainScene'), room.decode()])
        if (disposed || failed || !canvas.current) return
        scene = new PhotographicCurtainScene(canvas.current, () => {
          window.clearTimeout(timeout)
          if (!disposed && !failed) setReady(true)
        }, () => {
          window.clearTimeout(timeout)
          if (!disposed && !failed) callback.current()
        }, fail)
      } catch { window.clearTimeout(timeout); fail() }
    }
    void start()
    return () => {
      disposed = true
      window.clearTimeout(timeout)
      element?.removeEventListener('webglcontextlost', lost)
      scene?.dispose()
    }
  }, [reduce])

  if (reduce) return null
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0" data-curtain-engine={ready ? 'three' : 'fallback'}>
      {!ready && (['left', 'right'] as const).map((side) => (
        <motion.div key={side} className={`hero-drape hero-drape-${side}`}
          initial={{ scaleX: 1 }} animate={{ scaleX: fallback ? 0.155 : 1 }}
          transition={{ duration: 2.8, ease: [0.65, 0, 0.25, 1] }}
          onAnimationComplete={() => { if (fallback && side === 'left') callback.current() }} />
      ))}
      <canvas ref={canvas} className="absolute inset-0 size-full" style={{ opacity: ready ? 1 : 0 }} />
    </div>
  )
}
