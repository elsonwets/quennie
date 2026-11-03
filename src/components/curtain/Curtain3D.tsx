import { useReducedMotion } from '~/hooks/useReducedMotion'
import {  } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import type { CurtainScene, PleatShape } from './CurtainScene'

type Props = {
  background: string
  fabric: string
  opacity: number
  shape: PleatShape
  /** Drawn back when true, closed when false. */
  open: boolean
  openAmount?: number
  rodInset?: number
  duration?: number
  interactive?: boolean
  className?: string
  onOpened?: () => void
}

export function Curtain3D({
  background,
  fabric,
  opacity,
  shape,
  open,
  openAmount = 0.94,
  rodInset = 0.04,
  duration = 2.6,
  interactive = true,
  className = '',
  onOpened,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<CurtainScene | null>(null)
  const [ready, setReady] = useState(false)
  const reduce = useReducedMotion() ?? false
  const onOpenedRef = useRef(onOpened)
  onOpenedRef.current = onOpened

  // Three.js is browser-only: load it after hydration so SSR stays lean.
  useEffect(() => {
    let disposed = false
    import('./CurtainScene').then(({ CurtainScene }) => {
      if (disposed || !canvasRef.current) return
      sceneRef.current = new CurtainScene(canvasRef.current, {
        background,
        fabric,
        opacity,
        shape,
        rodInset,
        openAmount,
        startOpen: open && reduce,
        interactive: interactive && !reduce,
      })
      setReady(true)
    })
    return () => {
      disposed = true
      sceneRef.current?.dispose()
      sceneRef.current = null
    }
    // The scene is created once; later prop changes are pushed through the setters below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!ready) return
    sceneRef.current?.open(open ? openAmount : 0, reduce ? 0.001 : duration, () => onOpenedRef.current?.())
  }, [ready, open, openAmount, duration, reduce])

  useEffect(() => sceneRef.current?.setFabric(fabric), [fabric])
  useEffect(() => sceneRef.current?.setOpacity(opacity), [opacity])
  useEffect(() => sceneRef.current?.setShape(shape), [shape])

  return (
    // Callers set positioning (relative/absolute) through className.
    <div className={`overflow-hidden bg-[#d9cfc2] ${className}`}>
      {/* Static drape shown until WebGL is up, so there is never a flash of the room. */}
      <div aria-hidden="true" className="pleat-static absolute inset-0" />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={`absolute inset-0 size-full transition-opacity duration-500 ${ready ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  )
}
