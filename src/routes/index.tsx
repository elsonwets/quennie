import { MediaImage } from '~/components/MediaImage'
import media from '~/quennie-media.json'
import { useReducedMotion } from '~/hooks/useReducedMotion'
import { Link, createFileRoute } from '@tanstack/react-router'
import { AnimatePresence, motion, useScroll, useTransform } from 'motion/react'
import { useLayoutEffect, useRef, useState } from 'react'
import { CurtainHero } from '~/components/CurtainHero'
import { CurtainStudio } from '~/components/CurtainStudio'
import { ReelPlayer } from '~/components/ReelPlayer'
import { Marquee } from '~/components/motion/Marquee'
import { RevealText } from '~/components/motion/Reveal'
import { Manifesto } from '~/components/motion/Manifesto'
import { CursorPreview } from '~/components/motion/CursorPreview'
import { seo } from '~/seo'
import { Arrow, PageClosing } from '~/components/Editorial'
import { img, locations, process, services } from '~/content'

export const Route = createFileRoute('/')({
  head: () => seo({
    title: 'Design de interiores e cortinados à medida · Quennie',
    description: 'Estúdio de design de interiores na Guiné-Bissau e em Portugal: projeto 3D, mobiliário à medida, cortinados, estores e remodelações. Peça o seu orçamento.',
    path: '/',
  }),
  component: Home,
})
const titleClass = 'display text-[clamp(2.4rem,5vw,4.6rem)] italic'
function Home() {
  return <main><CurtainHero /><Intro /><Marquee items={services.map(s => s.name)} /><Services /><FromRenderToRoom /><Curtains /><Projects /><Reels /><Locations /><PageClosing title="Conte-nos o seu espaço." /></main>
}
function Intro() {
  return <section className="mx-auto max-w-[1440px] px-4 pt-28 pb-16 sm:px-8 md:pt-44"><h2 className="sr-only">Do primeiro esboço à última almofada, fazemos tudo</h2><Manifesto className="display max-w-[24ch] text-[clamp(2.3rem,5vw,5.2rem)] leading-[1.04]" text="Desenhamos o espaço, produzimos o mobiliário e os cortinados, e montamos tudo no local. Um só interlocutor, do primeiro esboço à última almofada." /><div className="mt-20 grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-24"><p className="max-w-[40ch] text-lg leading-relaxed text-nogueira/80">Para casas, escritórios, hotéis e restaurantes, na Guiné-Bissau, em Portugal e além.</p><div><ol className="grid gap-10 sm:grid-cols-3 sm:gap-8">{process.map((step, i) => <li key={step.title} className="border-t border-nogueira/20 pt-5"><span className="font-display text-3xl font-light text-cognac">{i + 1}</span><h3 className="mt-3 text-[1.05rem] font-normal">{step.title}</h3><p className="mt-2 text-[.95rem] leading-relaxed text-nogueira/75">{step.text}</p></li>)}</ol><Link to="/servicos" className="editorial-link mt-8">Conhecer os serviços <Arrow /></Link></div></div></section>
}
function Services() {
  const [active, setActive] = useState(0)
  return <section id="servicos" className="bg-linho-deep"><div className="mx-auto grid max-w-[1440px] gap-12 px-4 py-24 sm:px-8 md:py-32 lg:grid-cols-2 lg:gap-20"><div><RevealText className={titleClass}>O que fazemos</RevealText><CursorPreview items={services.map(service => ({ src: img(service.image, 900), alt: service.name }))} floatingClassName="lg:hidden">{bind => <ul className="mt-12 border-t border-nogueira/15">{services.map((service, i) => <li key={service.name} {...bind(i)} className="border-b border-nogueira/15"><button type="button" aria-pressed={active === i} onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} onClick={() => setActive(i)} className="w-full py-6 text-left"><span className={`font-display block text-[clamp(1.8rem,3vw,2.6rem)] font-light transition-colors ${active === i ? 'text-cognac italic' : 'text-nogueira'}`}>{service.name}</span><span className="mt-1 block max-w-[46ch] text-nogueira/75">{service.text}</span></button>{/* Below lg with a mouse, the image floats beside the pointer (CursorPreview); on touch screens it unfolds here. */}<AnimatePresence initial={false}>{active === i && <motion.div key="image" className="overflow-hidden lg:hidden pointer-fine:hidden" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.6, ease: [0.65, 0, 0.18, 1] }}><div className="relative mb-6 aspect-[4/5] max-h-[70svh] w-full overflow-hidden bg-linho sm:aspect-[4/3]"><img src={img(service.image, 1200)} alt={`Publicação da Quennie: ${service.name}`} loading="lazy" data-fabric="" className="absolute inset-0 size-full object-contain" /><span className="absolute top-3 left-3 z-20 bg-linho px-3 py-1 text-xs">Publicação da Quennie</span></div></motion.div>}</AnimatePresence></li>)}</ul>}</CursorPreview><Link to="/servicos" className="editorial-link mt-8">Explorar os serviços <Arrow /></Link></div><div className="home-service-image relative hidden aspect-[4/5] overflow-hidden bg-linho lg:block"><img key={services[active].image} src={img(services[active].image, 1400)} alt={`Publicação da Quennie: ${services[active].name}`} data-fabric="" className="absolute inset-0 size-full object-contain" /><span className="absolute top-3 left-3 z-20 bg-linho px-3 py-1 text-xs">Publicação da Quennie</span></div></div></section>
}
function FromRenderToRoom() {
  return <section className="mx-auto max-w-[1440px] px-4 py-24 sm:px-8 md:py-32"><div className="mb-12 grid gap-6 md:grid-cols-2 md:items-end"><RevealText className={titleClass}>Veja o espaço antes da obra começar</RevealText><p className="max-w-[46ch] text-nogueira/75 md:justify-self-end">Explore o estudo de interiores, os materiais e os bastidores nas publicações da Quennie.</p></div><div className="home-study-image"><MediaImage src="/media/7673552471175875858-01.webp" alt="Estudo em 3D partilhado pela Quennie" /><Link to="/projetos" className="editorial-link mt-4">Explorar todas as inspirações <Arrow /></Link></div></section>
}
function Curtains() {
  return <section id="cortinados" className="bg-linho-deep"><div className="mx-auto max-w-[1440px] px-4 py-24 sm:px-8 md:py-32"><div className="mb-12 max-w-3xl"><RevealText className={titleClass}>Cortinados e estores, confecionados à medida</RevealText><p className="mt-6 max-w-[56ch] text-nogueira/75">Escolha o tecido, a prega e a quantidade de luz que quer deixar entrar. Nós medimos, produzimos e montamos.</p><Link to="/cortinados" className="editorial-link mt-5">Explorar cortinados e estores <Arrow /></Link></div><CurtainStudio /></div></section>
}
const projects = media.map(post=>({title:post.title,type:post.category,image:post.cover,wide:!post.video}))

function Projects() {
  const section = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const [distance, setDistance] = useState(0)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance])
  useLayoutEffect(() => {
    const measure = () => { if (track.current) setDistance(Math.max(0, track.current.scrollWidth - window.innerWidth)) }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])
  return <section id="projetos" ref={section} className="relative" style={{ height: reduce ? undefined : `calc(100svh + ${distance}px)` }}><div className={reduce ? 'py-20' : 'sticky top-0 flex h-svh flex-col justify-center overflow-hidden'}><div className="mx-auto mb-10 w-full max-w-[1440px] px-4 sm:px-8"><RevealText className={titleClass}>Dentro do universo Quennie</RevealText><p className="mt-4 text-sm text-taupe">Imagens das publicações originais da Quennie.</p><Link to="/projetos" className="mt-3 inline-block underline underline-offset-4">Ver inspirações</Link></div><motion.div ref={track} style={{ x: reduce ? 0 : x }} className={`flex gap-6 px-4 sm:px-8 ${reduce ? 'overflow-x-auto' : ''}`}>{projects.map(project => <figure key={project.title} className={`group relative shrink-0 ${project.wide ? 'w-[78vw] md:w-[30vw]' : 'w-[62vw] md:w-[23vw]'}`}><div className="home-project-image"><MediaImage src={project.image!} alt={`Publicação da Quennie: ${project.title}`} framed /></div><figcaption className="mt-4 flex items-baseline justify-between gap-4"><span className="font-display text-2xl italic">{project.title}</span><span className="text-sm text-taupe">{project.type}</span></figcaption></figure>)}</motion.div></div></section>
}
function Reels() {
  return <section className="bg-linho-deep"><div className="mx-auto max-w-[1440px] px-4 py-24 sm:px-8 md:py-32"><div className="mb-14 max-w-3xl"><RevealText className={titleClass}>Os bastidores, em vídeo</RevealText><p className="mt-6 max-w-[54ch] text-nogueira/75">Montagens, inspirações e conselhos de design, com as imagens e os vídeos originais da Quennie.</p><Link to="/projetos" className="editorial-link mt-5">Todas as inspirações <Arrow /></Link></div><ReelPlayer /></div></section>
}
function Locations() {
  return <section id="onde" className="bg-palma text-linho"><div className="mx-auto grid max-w-[1440px] gap-14 px-4 py-24 sm:px-8 md:py-32 lg:grid-cols-[1fr_1.3fr]"><RevealText className={titleClass}>Da Guiné-Bissau a Portugal, e onde o seu projeto nos levar</RevealText><div><ul>{locations.map(loc => <li key={loc.country} className="grid gap-2 border-t border-linho/25 py-7 sm:grid-cols-[1fr_1.2fr]"><span className="font-display text-3xl font-light">{loc.country}</span><span className="text-linho/85 sm:pt-2">{loc.detail}</span></li>)}</ul><Link to="/contacto" className="editorial-link mt-6">Falar com a equipa <Arrow /></Link></div></div></section>
}
