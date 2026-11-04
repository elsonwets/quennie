import { motion, useMotionValue, useSpring } from 'motion/react'
import { createElement, useEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import { useReducedMotion } from '~/hooks/useReducedMotion'
import { Link } from '@tanstack/react-router'
import { Arrow } from './Editorial'

/** Shared spatial language; content stays visible without animation or pointer input. */
export function SpatialDepth({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion()
  const x = useMotionValue(0), y = useMotionValue(0)
  const rotateX = useSpring(x, { stiffness: 90, damping: 24 })
  const rotateY = useSpring(y, { stiffness: 90, damping: 24 })
  return <motion.div className={`spatial-depth ${className}`} style={{ rotateX: reduce ? 0 : rotateX, rotateY: reduce ? 0 : rotateY }} onPointerMove={event => {
    if (reduce || event.pointerType !== 'mouse') return
    const rect = event.currentTarget.getBoundingClientRect()
    x.set(-(event.clientY - rect.top - rect.height / 2) / rect.height * 7)
    y.set((event.clientX - rect.left - rect.width / 2) / rect.width * 9)
  }} onPointerLeave={() => { x.set(0); y.set(0) }}>{children}</motion.div>
}

let observer: IntersectionObserver | undefined
function revealObserver() {
  observer ??= new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) { (entry.target as HTMLElement).dataset.in = ''; observer!.unobserve(entry.target) }
  }, { rootMargin: '0px 0px -10% 0px' })
  return observer
}

/**
 * Arms the element (CSS hides it) only if it starts below the fold, then releases it as it enters
 * the viewport. Runs in the element's own effect, so the DOM is never touched before hydration;
 * server HTML, no-JS and reduced-motion visitors always see the content.
 */
function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || el.dataset.in !== undefined || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (el.dataset.armed === undefined) {
      if (el.getBoundingClientRect().top <= window.innerHeight * 0.9) return
      el.dataset.armed = ''
    }
    const io = revealObserver()
    io.observe(el)
    return () => io.unobserve(el)
  }, [])
  return ref
}

type RevealProps = { as?: 'div' | 'p' | 'li' | 'figure' | 'article'; kind?: '' | 'arch'; className?: string; style?: CSSProperties; children: ReactNode }

/** Rises (or, for `arch`, opens like a window) the first time it scrolls into view. */
export function Reveal({ as = 'div', kind = '', className, style, children }: RevealProps) {
  const ref = useReveal<HTMLElement>()
  return createElement(as, { ref, className, style, 'data-reveal': kind }, children)
}

export function SpatialReveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <Reveal className={className}>{children}</Reveal>
}

/**
 * A heading set line by line; each line rises out of its own mask. `onLoad` plays immediately
 * (above the fold), otherwise the lines wait until the heading scrolls into view.
 */
export function Lines({ as = 'h2', lines, className = '', onLoad = false }: { as?: 'h1' | 'h2' | 'h3' | 'p'; lines: ReactNode[]; className?: string; onLoad?: boolean }) {
  const ref = useReveal<HTMLHeadingElement>()
  return createElement(as, { ref: onLoad ? undefined : ref, className: `${className} ${onLoad ? 'lines-load' : ''}`.trim() || undefined, 'data-reveal': onLoad ? undefined : 'lines' },
    lines.map((line, i) => <span key={i} className="rl"><span style={{ '--i': i } as CSSProperties}>{line}{i < lines.length - 1 && ' '}</span></span>))
}

export function SpatialHero({ title, emphasis, description, image, imageAlt, caption, children, className = '' }: {
  title: string; emphasis: string; description: string; image: string; imageAlt: string; caption: string; children?: ReactNode; className?: string
}) {
  return <section className={`interior-hero ${className}`}>
    <div className="interior-hero-copy"><Lines as="h1" onLoad lines={[title, <em key="e">{emphasis}</em>]} /><p>{description}</p>{children}</div>
    <figure className="interior-hero-figure"><SpatialDepth><div className="interior-hero-frame"><img src={image} alt={imageAlt} fetchPriority="high" /></div></SpatialDepth><figcaption>{caption}</figcaption></figure>
  </section>
}

export function SpatialClosing({ title = 'O próximo espaço', emphasis = 'pode ser o seu.' }: { title?: string; emphasis?: string }) {
  return <section className="spatial-closing"><span>QUENNIE · HOME CONCEPT</span><Lines lines={[title, <i key="e">{emphasis}</i>]} /><Link to="/orcamento" className="spatial-pill">Começar um projeto <Arrow /></Link></section>
}
