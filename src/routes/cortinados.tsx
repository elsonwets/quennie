import { createFileRoute, Link } from '@tanstack/react-router'
import { absolute, breadcrumbs, seo } from '~/seo'

import { CurtainStudio } from '~/components/CurtainStudio'

import { Arrow, PageClosing } from '~/components/Editorial'



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

  return <main>

    <section className="curtain-page-intro"><div className="editorial-wrap"><h1 className="editorial-title">Entre a luz<br /><em>e a intimidade.</em></h1><p>Cortinados e estores feitos à medida do espaço. Do tecido ao acabamento, cada escolha muda a forma como a luz entra e o ambiente se sente.</p></div><img src="/images/hero-linen.webp" alt="Detalhe dos fios e das pregas de um tecido de linho" className="curtain-material" /></section>

    <section className="editorial-wrap material-notes"><h2 className="display italic">O detalhe que<br />muda o ambiente.</h2><div><article><h3>Tecido</h3><p>Textura, cor e transparência. Um tecido leve filtra a luz; uma solução opaca oferece mais resguardo.</p></article><article><h3>Prega</h3><p>Onda, prega americana ou franzido. A forma de reunir o tecido define o ritmo e a queda do cortinado.</p></article><article><h3>Instalação</h3><p>A largura, a altura e a posição da calha fazem parte do desenho. Partilhe as medidas e fotografias do espaço para começarmos.</p></article></div></section>

    <section className="curtain-playground"><div className="editorial-wrap"><div className="section-heading"><h2 className="display italic">Vamos brincar com a luz?</h2><p>Escolha entre 64 cores, guarde as suas favoritas e experimente cortinados ou estores. Leve a combinação de que mais gosta para o pedido de orçamento.</p></div><CurtainStudio /></div></section>

    <section className="editorial-wrap blind-section"><div className="blind-art" aria-hidden="true"><span /><span /><span /><span /><span /><span /></div><div><h2 className="display italic">Ou a discrição<br />de um estore.</h2><p className="editorial-body">Uma solução para controlar a luz e preservar a privacidade, integrada no desenho do espaço. Fale connosco sobre as dimensões, a utilização da divisão e a luz que pretende deixar entrar.</p><Link to="/orcamento" search={{ servico: 'Cortinados & estores', nota: 'Interesse em estores por medida' }} className="editorial-link">Pedir uma proposta <Arrow /></Link></div></section><PageClosing title="A sua luz, à sua medida." />

  </main>

}

