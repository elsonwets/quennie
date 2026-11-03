import { useReducedMotion } from '~/hooks/useReducedMotion'
import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'

const DRAPE = [0.65, 0, 0.18, 1] as const
const SETTLE = [0.22, 1, 0.36, 1] as const

type TextProps = {
  children: string
  as?: 'h1' | 'h2' | 'p'
  className?: string
  delay?: number
}

/** Words rise out of a mask, one after another, the first time they enter the viewport. */
export function RevealText({ children, as = 'h2', className = '', delay = 0 }: TextProps) {
  const reduce = useReducedMotion()
  const Tag = motion[as]
  const words = children.split(' ')

  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      aria-label={children}
    >
      {words.map((word, i) => (
        <span key={i} aria-hidden="true">
          <span className="inline-block overflow-hidden pb-[0.12em] align-top -mb-[0.12em]">
          <motion.span
            className="inline-block"
            variants={{
              hidden: reduce ? { y: 0 } : { y: '108%' },
              shown: { y: 0, transition: { duration: 1.05, delay: delay + i * 0.045, ease: SETTLE } },
            }}
          >
            {word}
          </motion.span>
          </span>
          {/* A real space keeps copy-paste and line wrapping natural. */}
          {i < words.length - 1 && ' '}
        </span>
      ))}
    </Tag>
  )
}

type ImageProps = {
  src: string
  alt: string
  className?: string
  imgClassName?: string
  /** Subtle vertical drift while scrolling past. */
  parallax?: boolean
}

/** Images part from the centre like a pair of drapes, then settle as the scale eases off. */
export function RevealImage({ src, alt, className = '', imgClassName = '', parallax = true }: ImageProps) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], parallax && !reduce ? ['-6%', '6%'] : ['0%', '0%'])

  return (
    <motion.div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      initial={reduce ? false : { clipPath: 'inset(0% 50% 0% 50%)' }}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 1.5, ease: DRAPE }}
    >
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        className={`absolute inset-[-7%_0] h-[114%] w-full object-cover ${imgClassName}`}
        style={{ y }}
        initial={reduce ? false : { scale: 1.18 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2, ease: SETTLE }}
      />
    </motion.div>
  )
}
