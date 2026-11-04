import { Link, createFileRoute } from '@tanstack/react-router'
import { motion, useMotionValue, useSpring } from 'motion/react'
import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { useCurtainIntro } from '~/components/CurtainIntro'
import { Arrow } from '~/components/Editorial'
import { CurtainStudio } from '~/components/CurtainStudio'
import { ReelPlayer } from '~/components/ReelPlayer'
import { Lines, Reveal } from '~/components/Spatial'
import { Marquee } from '~/components/motion/Marquee'
import { useReducedMotion } from '~/hooks/useReducedMotion'
import { services, process } from '~/content'
import media from '~/quennie-media.json'
import { seo } from '~/seo'

export const Route = createFileRoute('/')({ head: () => seo({ title: 'Design de interiores e cortinados à medida · Quennie', description: 'Interiores com identidade. Design de interiores, mobiliário e cortinados à medida, na Guiné-Bissau e em Portugal.', path: '/' }), component: Home })

function Depth({ children, className = '' }: { children: ReactNode; className?: string }) {
 const reduce = useReducedMotion(), x = useMotionValue(0), y = useMotionValue(0)
 const rotateX = useSpring(x, { stiffness: 85, damping: 22 }), rotateY = useSpring(y, { stiffness: 85, damping: 22 })
 return <motion.div className={`spatial-depth ${className}`} style={{ rotateX: reduce ? 0 : rotateX, rotateY: reduce ? 0 : rotateY }} onPointerMove={e => { if (reduce || e.pointerType !== 'mouse') return; const r = e.currentTarget.getBoundingClientRect(); x.set(-(e.clientY-r.top-r.height/2)/r.height*9); y.set((e.clientX-r.left-r.width/2)/r.width*12) }} onPointerLeave={() => { x.set(0); y.set(0) }}>{children}</motion.div>
}

function Home() {
 const { finish } = useCurtainIntro()
 // The drapes open on a fresh page load only. While hydrating, the server-rendered drapes are
 // already in the document; on an in-app navigation to the home page they are not.
 const [arrival] = useState(() => typeof document === 'undefined' || !!document.querySelector('.arrival'))
 useEffect(() => { finish() }, [finish])
 return <main className={`spatial-home ${arrival ? 'has-arrival' : ''}`} id="main-content">
  {arrival && <Arrival />}
  <ArchHero />
  <StudioDetail />
  <Selection />
  <Expertise />
  <Materials />
  <Journal />
  <Closing />
 </main>
}

/** Two linen panels, a seam of light, then the room. Pure CSS so it never blocks the page. */
function Arrival() {
 const [shown, setShown] = useState(true)
 useEffect(() => {
  // CSS already hides it at ~2.2s; this only removes the node (hydration can land after the animation).
  const timer = window.setTimeout(() => setShown(false), Math.max(0, 2600 - performance.now()))
  return () => window.clearTimeout(timer)
 }, [])
 if (!shown) return null
 return <div className="arrival" aria-hidden="true">
  <div className="arrival-drape arrival-drape-left" />
  <div className="arrival-drape arrival-drape-right" />
  <div className="arrival-seam" />
  <div className="arrival-mark">Quennie<span>HOME CONCEPT & INTERIOR DESIGN</span></div>
 </div>
}

/**
 * The room fills the screen, then steps back into an arched window as the studio introduces
 * itself around it. Driven by CSS scroll timelines; elsewhere it falls back to a plain sequence.
 */
function ArchHero() {
 return <div className="arch-track">
  {/* Where "Entre" lands: the formed arch when pinned, otherwise the start of the studio. Kept
      outside the sticky stage so its document position never depends on the scroll position. */}
  <span id="studio" className="arch-anchor" />
  <div className="arch-stage">
   <section className="spatial-hero arch-hero" aria-labelledby="hero-title">
    <div className="arch-window">
     <div className="spatial-hero-photo"><img src="/images/hero-interior.jpg" alt="Inspiração: sala aberta à luz natural, com madeira, linho e vegetação" fetchPriority="high" /></div>
     <div className="spatial-hero-shade" />
    </div>
    <div className="arch-overlay">
     <div className="spatial-hero-top"><span>INTERIOR DESIGN & HOME CONCEPT</span><span>GUINÉ-BISSAU · PORTUGAL</span></div>
     <div className="spatial-hero-title">
      <h1 id="hero-title"><span>O espaço.</span><span>A sua <i>essência.</i></span></h1>
      <div className="spatial-hero-aside">
       <svg className="spatial-star" aria-hidden="true" viewBox="0 0 60 60" fill="none">{[0,30,60,90,120,150].map(a=><path key={a} d="M30 2v56" stroke="currentColor" transform={`rotate(${a} 30 30)`}/>)}</svg>
       <p>Interiores que se sentem.<br />Detalhes que ficam.</p>
       <Link to="/orcamento" className="spatial-pill">Começar um projeto <Arrow /></Link>
      </div>
     </div>
     <div className="spatial-hero-bottom"><a href="#studio" className="spatial-scroll"><Arrow /> ENTRE NO NOSSO UNIVERSO</a><span className="spatial-image-credit">Imagem de ambiente · inspiração</span><span className="spatial-hero-signature">Feito para viver.</span></div>
    </div>
   </section>
   {/* The studio's claim is set around the window; the details follow once the stage releases. */}
   <div className="arch-studio">
    <span className="arch-caption">Imagem de ambiente · inspiração</span>
    <div className="arch-studio-a">
     <p className="arch-eyebrow"><span>O ESTÚDIO</span><span>Uma visão. Do conceito ao detalhe.</span></p>
     <h2 id="studio-title">Uma casa não é apenas um lugar.</h2>
    </div>
    <p className="arch-studio-b arch-claim"><i>É uma forma de ser.</i></p>
   </div>
  </div>
 </div>
}

function StudioDetail() {
 return <section className="arch-detail" aria-labelledby="studio-title">
  <Reveal>
   <p>Desenhamos o espaço, produzimos o mobiliário e os cortinados, e montamos tudo no local. Um só interlocutor, do primeiro esboço à última almofada. Para casas, escritórios, hotéis e restaurantes.</p>
   <Link to="/servicos" className="spatial-text-link">Conheça a nossa abordagem <Arrow /></Link>
  </Reveal>
 </section>
}

const selected = ['7673552471175875858','7673556834803846407','7673540222692379911'].map(id=>media.find(p=>p.id===id)!).filter(Boolean)
function Selection() {
 return <section className="spatial-selection spatial-wrap" id="inspiracoes">
  <div className="spatial-section-heading">
   <Lines lines={['Dentro do nosso', <i key="i">universo.</i>]} />
   <Reveal><p>Ideias, espaços e detalhes.<br />Uma seleção de publicações da Quennie.</p><Link to="/projetos" className="spatial-text-link">Todas as inspirações <Arrow /></Link></Reveal>
  </div>
  <div className="spatial-project-grid">{selected.map((post,i)=><a key={post.id} href={post.href} target="_blank" rel="noopener noreferrer" className={`spatial-project spatial-project-${i}`}>
   <Depth><Reveal kind="arch" className="spatial-project-image"><img src={post.cover!} alt={post.title} loading="lazy" /><span className="spatial-project-open"><Arrow /></span></Reveal></Depth>
   <div className="spatial-project-caption"><h3>{post.title}</h3><span>{post.category}</span></div>
   <span className="spatial-source">Publicação Quennie · Ver no TikTok</span>
  </a>)}</div>
 </section>
}

function Expertise() {
 const [active,setActive]=useState(0)
 return <section className="spatial-expertise">
  <Marquee items={services.map(s=>s.name)} />
  <div className="spatial-wrap">
   <div className="spatial-section-caption"><span>O QUE FAZEMOS</span><span>Do primeiro traço à última textura.</span></div>
   <div className="spatial-expertise-grid">
    <div>
     <Lines lines={['Uma visão', <i key="i">por inteiro.</i>]} />
     <div className="spatial-service-list">{services.map((s,i)=><button key={s.name} type="button" aria-pressed={active===i} aria-controls="service-detail" onClick={()=>setActive(i)} className={active===i?'is-active':''}><span>{s.name}</span><Arrow /></button>)}</div>
     <Link to="/servicos" className="spatial-text-link">Explorar os serviços <Arrow /></Link>
    </div>
    <div id="service-detail" aria-live="polite">
     <Depth className="spatial-service-visual"><img key={services[active].image} src={services[active].image} alt={`Publicação Quennie: ${services[active].name}`} loading="lazy" /></Depth>
     <p className="spatial-service-description">{services[active].text}</p>
     <span className="spatial-source">Publicação original da Quennie</span>
    </div>
   </div>
   <ol className="spatial-process">{process.map((s,i)=><Reveal as="li" key={s.title} style={{ '--d': `${i * 0.12}s` } as CSSProperties}><span>0{i+1}</span><div><h3>{s.title}</h3><p>{s.text}</p></div></Reveal>)}</ol>
  </div>
 </section>
}

function Materials() {
 const [open,setOpen]=useState(false)
 return <section className="spatial-materials spatial-wrap">
  <div className="spatial-material-grid">
   <div className="spatial-material-scene" aria-hidden="true"><Depth className="spatial-material-object"><div className="material-stone" /><div className="material-linen" /><div className="material-ring" /><span className="material-label">A matéria dá o tom.</span></Depth></div>
   <div className="spatial-material-copy">
    <Lines lines={['Luz. Textura.', <i key="i">Sensação.</i>]} />
    <p>O tecido certo muda a forma como a luz entra. E a forma como se sente em casa. Cortinados e estores pensados ao milímetro, confecionados para o seu espaço.</p>
    <button className="spatial-text-link" onClick={()=>setOpen(v=>!v)} aria-expanded={open} aria-controls="curtain-experience">{open?'Fechar a experiência':'Explorar tecidos e luz'} <Arrow /></button>
    <Link to="/cortinados" className="spatial-secondary-link">Conhecer os cortinados à medida</Link>
   </div>
  </div>
  <div id="curtain-experience">{open && <div className="spatial-curtain-experience"><CurtainStudio /></div>}</div>
 </section>
}

function Journal() {
 return <section className="spatial-journal spatial-wrap">
  <div className="spatial-section-heading"><Lines lines={['O design', <i key="i">acontece.</i>]} /><Reveal as="p">Nos bastidores da Quennie.<br />Da ideia à montagem, em vídeo.</Reveal></div>
  <ReelPlayer />
 </section>
}

function Closing() {
 return <section className="spatial-closing">
  <span>GUINÉ-BISSAU & PORTUGAL</span>
  <Lines lines={['O próximo espaço', <>pode ser <i>o seu.</i></>]} />
  <Link to="/orcamento" className="spatial-pill">Vamos conversar <Arrow /></Link>
  <p>Design de interiores · Mobiliário · Cortinados</p>
 </section>
}
