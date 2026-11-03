import { Link } from '@tanstack/react-router'
import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { social, whatsappLink } from '~/content'

export function SiteFooter() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  // The signature rises into place as the page runs out.
  const y = useTransform(scrollYProgress, [0, 1], ['45%', '0%'])

  return (
    <footer ref={ref} className="overflow-hidden bg-nogueira text-linho">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-4 pt-20 pb-10 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <p className="display max-w-[16ch] text-[clamp(2rem,3.4vw,3.2rem)] italic text-linho/90">
          Cada espaço começa com uma conversa.
        </p>

        <div className="space-y-2 text-linho/80">
          <p className="text-linho/65">Explore</p>
          <Link to="/servicos" className="block hover:text-linho">Serviços</Link>
          <Link to="/cortinados" className="block hover:text-linho">Cortinados &amp; estores</Link>
          <Link to="/projetos" className="block hover:text-linho">Inspirações</Link>
          <Link to="/contacto" className="block hover:text-linho">Contacto</Link>
          <a className="block hover:text-linho" href={whatsappLink('Olá Quennie!')} target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>
          <Link to="/orcamento" className="block hover:text-linho">
            Pedir orçamento
          </Link>
        </div>

        <div className="space-y-2 text-linho/80">
          <p className="text-linho/45">Acompanhe</p>
          <a className="block hover:text-linho" href={social.instagram} target="_blank" rel="noopener noreferrer">
            Instagram
          </a>
          <a className="block hover:text-linho" href={social.tiktok} target="_blank" rel="noopener noreferrer">
            TikTok
          </a>
        </div>
      </div>

      <motion.p
        aria-hidden="true"
        style={{ y }}
        className="font-display -mb-[0.2em] select-none text-center text-[clamp(7rem,30vw,30rem)] leading-[0.8] font-light tracking-[-0.04em] text-linho/[0.07]"
      >
        Quennie
      </motion.p>
      <div className="mx-auto flex max-w-[1440px] flex-wrap justify-between gap-2 border-t border-linho/10 px-4 py-6 text-sm text-linho/40 sm:px-8">
        <span>© {new Date().getFullYear()} Quennie Home Concept &amp; Interior Design</span>
        <span>Guiné-Bissau e Portugal</span>
      </div>
    </footer>
  )
}
