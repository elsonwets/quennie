import { useReducedMotion } from '~/hooks/useReducedMotion'
import { Link } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { useCurtainIntro } from './CurtainIntro'
import { PhotographicCurtain } from './curtain/PhotographicCurtain'

export function CurtainHero() {
  const { ready, finish } = useCurtainIntro()
  const reduce = useReducedMotion() ?? false

  return (
    <section data-curtain-state={ready ? 'revealed' : 'opening'} className="relative z-20 -mt-[5.5rem] h-svh min-h-[480px] w-full">
      {/* The room stays inside its frame... */}
      <div className="absolute inset-0 overflow-hidden bg-nogueira">
        <img
          src="/images/hero-interior.jpg"
          alt=""
          fetchPriority="high"
          className="absolute inset-0 size-full object-cover"
        />
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: ready ? 1 : 0 }} transition={{ duration: 0.7 }} className="pointer-events-none absolute inset-y-0 inset-x-[8%] hero-shade" />
      </div>
      {/* ...while the drapes hang in front of it and fall past its lower edge onto the page. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[calc(100%+14svh)]">
        <PhotographicCurtain onOpened={finish} />
      </div>

      {/* Inset past the gathered drapes on either side. */}
      <motion.div
        inert={!ready}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 16 }}
        transition={{ duration: reduce ? 0 : 0.7 }}
        style={{ visibility: ready ? 'visible' : 'hidden' }}
        className="pointer-events-none absolute inset-x-[10%] bottom-0 pb-8 sm:pb-14"
      >
        <h1
          className="display hero-title italic text-linho"
        >
          Espaços desenhados e feitos à medida de quem os vive
        </h1>
        <div className="hero-actions pointer-events-auto mt-8 flex flex-wrap items-center gap-x-10 gap-y-5">
          <Link
            to="/orcamento"
            className="hero-cta group inline-flex items-center gap-8 border-b border-linho/60 py-3 text-linho transition-colors hover:border-linho"
          >
            Pedir orçamento
            <svg aria-hidden="true" viewBox="0 0 32 16" className="h-4 w-8 transition-transform duration-300 group-hover:translate-x-1" fill="none"><path d="M0 8h30m-7-7 7 7-7 7" stroke="currentColor" /></svg>
          </Link>
          <p className="max-w-[32ch] text-sm leading-relaxed text-linho/90">
            Interiores, mobiliário, cortinados e estores. Na Guiné-Bissau, em Portugal e além.
          </p>
        </div>
      </motion.div>
    </section>
  )
}
