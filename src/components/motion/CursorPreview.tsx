import { AnimatePresence, motion, useMotionValue, useSpring, useTransform, useVelocity } from 'motion/react'
import { useEffect, useState, type ReactNode } from 'react'

type Item = { src: string; alt: string }

/**
 * An image that floats beside the pointer while it hovers a list. `children` receives the
 * handlers to spread on each row. Only mounts on hover-capable (mouse) devices.
 */
export function CursorPreview({
  items,
  className = '',
  floatingClassName = '',
  children,
}: {
  items: Item[]
  className?: string
  /** Extra classes for the floating card, e.g. to hide it where a static image already shows. */
  floatingClassName?: string
  children: (bind: (index: number) => { onPointerEnter: () => void }) => ReactNode
}) {
  const [hovered, setHovered] = useState<number | null>(null)
  const [fine, setFine] = useState(false)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 180, damping: 22, mass: 0.6 })
  const sy = useSpring(y, { stiffness: 180, damping: 22, mass: 0.6 })
  // The card leans into the direction of travel, like fabric dragged through air.
  const rotate = useTransform(useVelocity(sx), [-1500, 0, 1500], [-9, 0, 9], { clamp: true })

  useEffect(() => {
    const query = window.matchMedia('(hover: hover) and (pointer: fine)')
    const update = () => setFine(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  const move = (e: React.PointerEvent) => {
    if (!fine) return
    const width = Math.min(window.innerWidth * 0.42, 280)
    // Sit to the right of the pointer, flipping to the left near the edge of the screen.
    const right = e.clientX + 28 + width < window.innerWidth
    x.set(right ? e.clientX + 28 : e.clientX - 28 - width)
    y.set(e.clientY - width * 0.62)
  }

  const bind = (index: number) => ({ onPointerEnter: () => fine && setHovered(index) })

  return (
    <div className={className} onPointerMove={move} onPointerLeave={() => setHovered(null)}>
      {children(bind)}
      {fine && (
        <motion.div
          aria-hidden="true"
          className={`pointer-events-none fixed top-0 left-0 z-[60] w-[min(42vw,280px)] ${floatingClassName}`}
          style={{ x: sx, y: sy, rotate }}
        >
          <AnimatePresence>
            {hovered !== null && (
              <motion.div
                key={items[hovered].src}
                className="absolute inset-x-0 top-0 aspect-[4/5] overflow-hidden bg-linho shadow-[0_30px_60px_-25px_rgb(42_30_23/0.55)]"
                initial={{ clipPath: 'inset(0% 50% 0% 50%)', opacity: 0 }}
                animate={{ clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 }}
                exit={{ clipPath: 'inset(0% 50% 0% 50%)', opacity: 0 }}
                transition={{ duration: 0.55, ease: [0.65, 0, 0.18, 1] }}
              >
                <img src={items[hovered].src} alt="" className="size-full object-contain" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}
