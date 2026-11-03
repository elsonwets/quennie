import { useReducedMotion } from '~/hooks/useReducedMotion'
import { motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity, wrap,  } from 'motion/react'
import { useRef } from 'react'

function PleatGlyph() {
  return (
    <svg viewBox="0 0 40 40" className="mx-[0.35em] inline-block size-[0.42em] align-middle text-cognac" aria-hidden="true">
      <path d="M4 4c6 0 6 32 12 32S22 4 28 4s6 32 8 32" fill="none" stroke="currentColor" strokeWidth="3" />
    </svg>
  )
}

/** A line of type that drifts on its own and leans into the reader's scroll speed. */
export function Marquee({ items, baseVelocity = -2.2 }: { items: string[]; baseVelocity?: number }) {
  const reduce = useReducedMotion()
  const baseX = useMotionValue(0)
  const { scrollY } = useScroll()
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 })
  const factor = useTransform(velocity, [-1500, 0, 1500], [-4, 0, 4], { clamp: false })
  const skew = useTransform(velocity, [-2000, 2000], [6, -6])
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

  const line = (
    <>
      {items.map((item) => (
        <span key={item}>
          {item}
          <PleatGlyph />
        </span>
      ))}
    </>
  )

  return (
    <div className="overflow-hidden py-6" aria-label={items.join(', ')}>
      <motion.div
        aria-hidden="true"
        className="display flex whitespace-nowrap text-[clamp(3rem,9vw,9rem)] italic"
        style={{ x, skewX: reduce ? 0 : skew }}
      >
        {[0, 1, 2, 3].map((n) => (
          <span key={n} className="block pr-[0.3em]">
            {line}
          </span>
        ))}
      </motion.div>
    </div>
  )
}
