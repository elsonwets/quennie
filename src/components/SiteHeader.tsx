import { Link } from '@tanstack/react-router'
import { motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useState } from 'react'
import { useCurtainIntro } from './CurtainIntro'

const nav = [
  { label: 'Serviços', to: '/servicos' },
  { label: 'Cortinados', to: '/cortinados' },
  { label: 'Inspirações', to: '/projetos' },
  { label: 'Contacto', to: '/contacto' },
] as const

export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`flex flex-col leading-none ${className}`}>
      <span className="wordmark-name font-display font-light tracking-tight">Quennie</span>
      <span className="wordmark-caption mt-1">
        Home Concept &amp; Interior Design
      </span>
    </span>
  )
}

export function SiteHeader() {
  const { ready, isHome } = useCurtainIntro()
  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const overHero = isHome && !scrolled
  const { scrollY } = useScroll()

  // Step out of the way while reading down; come back as soon as the reader scrolls up.
  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setScrolled(y > 40)
    setHidden(y > 240 && y > prev && !open)
  })

  return (
    <motion.header
      inert={!ready}
      initial={false}
      style={{ visibility: ready ? 'visible' : 'hidden' }}
      className={`fixed top-0 z-50 transition-colors duration-500 ${overHero ? 'inset-x-[10%]' : 'inset-x-0'} ${overHero && !open ? 'hero-header' : ''} ${
        open || scrolled ? 'bg-linho/85 backdrop-blur-md' : overHero ? 'bg-transparent' : 'bg-linho'
      }`}
      animate={{ opacity: ready ? 1 : 0, y: !ready || hidden ? '-100%' : '0%' }}
      transition={{ duration: 0.6, ease: [0.65, 0, 0.18, 1] }}
    >
      <div className="relative mx-auto flex max-w-[1440px] items-center justify-between px-4 py-5 sm:px-8">
        <Link to="/" aria-label="Quennie, página inicial" onClick={() => setOpen(false)}>
          <Wordmark />
        </Link>

        <nav className="hidden items-center gap-9 text-[0.9rem] xl:flex" aria-label="Principal">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              viewTransition={false}
              className="group relative text-nogueira/80 transition-colors hover:text-nogueira"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-cognac transition-transform duration-500 ease-[var(--ease-drape)] group-hover:origin-left group-hover:scale-x-100" />
            </Link>
          ))}
          <Link
            to="/orcamento"
            className="rounded-full bg-nogueira px-5 py-2.5 text-linho transition-colors hover:bg-cognac"
          >
            Pedir orçamento
          </Link>
        </nav>

        <button
          type="button"
          className="min-h-11 px-2 text-[0.9rem] xl:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? 'Fechar' : 'Menu'}
        </button>

        {open && (
          <nav
            id="mobile-nav"
            aria-label="Principal"
            className="absolute inset-x-0 top-full flex h-[calc(100svh-5.5rem)] flex-col gap-1 overflow-y-auto bg-linho px-4 pb-8 pt-6 xl:hidden"
          >
            {nav.map((item, i) => (
              <motion.div
                key={item.to}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  to={item.to}
                  viewTransition={false}
                  onClick={() => setOpen(false)}
                  className="font-display block py-2 text-[clamp(2rem,7vw,3rem)] font-light italic"
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
            <Link
              to="/orcamento"
              onClick={() => setOpen(false)}
              className="mt-auto rounded-full bg-nogueira px-5 py-4 text-center text-linho"
            >
              Pedir orçamento
            </Link>
          </nav>
        )}
      </div>
    </motion.header>
  )
}
