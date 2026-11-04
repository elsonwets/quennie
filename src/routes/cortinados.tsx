import { createFileRoute, Link } from '@tanstack/react-router'
import { absolute, breadcrumbs, seo } from '~/seo'

import type { CSSProperties } from 'react'
import { CurtainStudio } from '~/components/CurtainStudio'

import { Arrow } from '~/components/Editorial'
import { SpatialHero, SpatialDepth, SpatialClosing, Lines, Reveal } from '~/components/Spatial'



export const Route = createFileRoute('/cortinados')({ head: () => seo({
  title: 'Cortinados e estores à medida · Quennie',
  description: 'Cortinados e estores feitos à medida: onda, prega americana ou franzido, do voile ao blackout. Experimente cores e pregas e peça o seu orçamento personalizado.',
  path: '/cortinados',
  jsonLd: [
    { '@type': 'Service', name: 'Cortinados e estores à medida', serviceType: 'Confeção e instalação de cortinados e estores', provider: { '@id': absolute('/#quennie') }, areaServed: ['Guiné-Bissau', 'Portugal', 'Senegal'] },
    breadcrumbs([{ name: 'Cortinados & estores', path: '/cortinados' }]),
  ],
}), component: CurtainsPage })

function CurtainsPage() {
 return <main className="interior-page curtains-page"><SpatialHero className="fabric-hero" title="Entre a luz" emphasis="e a intimidade." description="Um gesto suave. Uma nova atmosfera. Cortinados e estores confecionados à medida, do tecido ao último acabamento." image="/images/hero-linen.webp" imageAlt="Textura e pregas de um tecido de linho" caption="Textura, queda e transparência"><a href="#atelier" className="spatial-text-link">Criar a minha combinação <Arrow /></a></SpatialHero>
 <section className="fabric-principles"><Lines lines={['O detalhe que', <em key="e">muda tudo.</em>]} /><div>{[{title:'Tecido',text:'Textura, cor e transparência. Um tecido leve filtra a luz; uma solução opaca oferece mais resguardo.'},{title:'Prega',text:'Onda, prega americana ou franzido. A forma de reunir o tecido define o ritmo e a queda do cortinado.'},{title:'Instalação',text:'A largura, a altura e a posição da calha fazem parte do desenho. Partilhe medidas e fotografias do espaço para começarmos.'}].map((item,i)=><Reveal as="article" key={item.title} style={{'--d':`${i*0.12}s`} as CSSProperties}><h3>{item.title}</h3><p>{item.text}</p></Reveal>)}</div></section>
 <section className="fabric-atelier" id="atelier"><div className="interior-section-title"><Lines lines={['O seu atelier', <em key="e">de luz.</em>]} /><p>Explore 64 cores, experimente pregas e transparências. Guarde as favoritas e leve a sua combinação para o pedido de orçamento.</p></div><CurtainStudio /></section>
 <section className="fabric-blinds"><SpatialDepth><div className="blind-art" aria-hidden="true"><span/><span/><span/><span/><span/><span/></div></SpatialDepth><div><Lines lines={['Menos tecido.', <em key="e">A mesma intenção.</em>]} /><p>Uma solução para controlar a luz e preservar a privacidade, integrada no desenho do espaço. Fale connosco sobre as dimensões e a utilização da divisão.</p><Link to="/orcamento" search={{servico:'Cortinados & estores',nota:'Interesse em estores por medida'}} className="spatial-text-link">Pensar o meu estore <Arrow /></Link></div></section><SpatialClosing title="A sua luz," emphasis="à sua medida." /></main>
}
