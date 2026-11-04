import { useReducedMotion } from '~/hooks/useReducedMotion'
import { motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity, wrap } from 'motion/react'
import { useRef } from 'react'

/** The same six-ray star that signs the home hero. */
function StarGlyph() {
  return (
    <svg viewBox="0 0 60 60" className="marquee-glyph" aria-hidden="true" fill="none">
      {[0, 30, 60, 90, 120, 150].map((a) => <path key={a} d="M30 2v56" stroke="currentColor" strokeWidth="1.6" transform={`rotate(${a} 30 30)`} />)}
    </svg>
  )
}

/**
 * A line of type that drifts on its own and leans into the reader's scroll speed.
 * Decorative: the same words are always available as real content nearby.
 */
export function Marquee({ items, baseVelocity = -2.2, className = '' }: { items: string[]; baseVelocity?: number; className?: string }) {
  const reduce = useReducedMotion()
  const baseX = useMotionValue(0)
  const { scrollY } = useScroll()
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 })
  const factor = useTransform(velocity, [-1500, 0, 1500], [-4, 0, 4], { clamp: false })
  const skew = useTransform(velocity, [-2000, 2000], [5, -5])
  const x = useTransform(baseX, (v) => `${wrap(-25, -50, v)}%`)
  const direction = useRef(1)

  useAnimationFrame((_, delta) => {
    if (reduce) return
    let move = direction.current * baseVelocity * (delta / 1000)
    const f = factor.get()
    if (f < 0) direction.current = -1
    else if (f > 0) direction.current = 1
    move += direction.current * move * f
    baseX.set(baseX.get() + move)
  })

  return (
    <div className={`spatial-marquee ${className}`} aria-hidden="true">
      <motion.div className="spatial-marquee-track" style={{ x, skewX: reduce ? 0 : skew }}>
        {[0, 1, 2, 3].map((n) => (
          <span key={n}>
            {items.map((item) => <span key={item}>{item}<StarGlyph /></span>)}
          </span>
        ))}
      </motion.div>
    </div>
  )
}
