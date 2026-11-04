import { Link, useRouterState } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useMotionValueEvent, useScroll } from 'motion/react'
import { Arrow } from './Editorial'
const nav = [{ label: 'O que fazemos', to: '/servicos' }, { label: 'Inspirações', to: '/projetos' }, { label: 'Cortinados', to: '/cortinados' }, { label: 'Contacto', to: '/contacto' }] as const
export function Wordmark({ className = '' }: { className?: string }) { return <span className={`spatial-wordmark ${className}`}>Quennie<span>HOME CONCEPT & INTERIOR DESIGN</span></span> }
export function SiteHeader() {
 const isHome = useRouterState({select:s=>s.location.pathname==='/'}), [open,setOpen]=useState(false), [scrolled,setScrolled]=useState(false)
 const {scrollY}=useScroll(); useMotionValueEvent(scrollY,'change',y=>setScrolled(y>60))
 useEffect(()=>{ if(!open)return; const close=(e:KeyboardEvent)=>{if(e.key==='Escape')setOpen(false)}; document.addEventListener('keydown',close); return ()=>document.removeEventListener('keydown',close) },[open])
 return <header className={`spatial-header ${isHome&&!scrolled&&!open?'on-hero':''}`}><a href="#main-content" className="spatial-skip">Saltar para o conteúdo</a><Link to="/" aria-label="Quennie, página inicial" onClick={()=>setOpen(false)}><Wordmark /></Link><nav className="spatial-desktop-nav" aria-label="Principal">{nav.map(item=><Link key={item.to} to={item.to} activeProps={{'aria-current':'page'}}>{item.label}</Link>)}</nav><Link to="/orcamento" className="spatial-header-cta">O seu projeto <Arrow /></Link><button type="button" className="spatial-menu-toggle" aria-expanded={open} aria-controls="mobile-nav" onClick={()=>setOpen(v=>!v)}>{open?'Fechar':'Menu'}<span aria-hidden="true">{open?'−':'+'}</span></button>{open&&<nav id="mobile-nav" className="spatial-mobile-nav" aria-label="Navegação móvel">{nav.map(item=><Link key={item.to} to={item.to} onClick={()=>setOpen(false)}>{item.label}<Arrow /></Link>)}<Link to="/orcamento" onClick={()=>setOpen(false)}>Começar um projeto <Arrow /></Link><p>Guiné-Bissau · Portugal</p></nav>}</header>
}
