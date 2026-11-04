import { createFileRoute, Link } from '@tanstack/react-router'
import { absolute, breadcrumbs, seo } from '~/seo'

import { Arrow } from '~/components/Editorial'

import { social, whatsappLink } from '~/content'
import { SpatialHero, Lines } from '~/components/Spatial'



export const Route = createFileRoute('/contacto')({ head: () => seo({
  title: 'Contacto · Quennie Interior Design',
  description: 'Fale com a Quennie pelo WhatsApp sobre o seu projeto de interiores, mobiliário, cortinados ou estores, na Guiné-Bissau, em Portugal ou noutro país.',
  path: '/contacto',
  jsonLd: [{ '@type': 'ContactPage', name: 'Contacto', about: { '@id': absolute('/#quennie') } }, breadcrumbs([{ name: 'Contacto', path: '/contacto' }])],
}), component: ContactPage })

function ContactPage() {
 return <main className="interior-page contact-page"><SpatialHero title="Tudo começa" emphasis="com uma conversa." description="Uma divisão, uma casa ou um espaço de trabalho. Conte-nos o que imagina e o que precisa de mudar." image="/images/hero-interior.jpg" imageAlt="Inspiração: sala com mobiliário e materiais naturais" caption="Imagem de ambiente · inspiração"><a href={whatsappLink('Olá Quennie, gostaria de falar sobre o meu espaço.')} target="_blank" rel="noopener noreferrer" className="spatial-text-link">Falar connosco no WhatsApp <Arrow /></a></SpatialHero>
 <section className="contact-salon"><div><Lines lines={['O seu espaço.', <em key="a">A nossa próxima</em>, <em key="b">conversa.</em>]} /><a href={whatsappLink('Olá Quennie, gostaria de falar sobre o meu espaço.')} target="_blank" rel="noopener noreferrer" className="spatial-pill">Abrir o WhatsApp <Arrow /></a><p>A conversa abre diretamente no WhatsApp.</p></div><div className="contact-salon-options"><article><h3>Já tem uma ideia?</h3><p>Partilhe o tipo de espaço, os serviços que procura e a localização. Prepare o pedido antes de iniciar a conversa.</p><Link to="/orcamento" className="spatial-text-link">Preparar o meu pedido <Arrow /></Link></article><article><h3>Guiné-Bissau & Portugal</h3><p>Para projetos noutros países, fale com a equipa sobre a localização e o âmbito da intervenção.</p></article></div></section>
 <section className="contact-follow"><Lines lines={['Para continuar', <em key="e">a conversa.</em>]} /><div><a href={social.instagram} target="_blank" rel="noopener noreferrer"><span>Instagram<small>Imagens e inspirações</small></span><Arrow /></a><a href={social.tiktok} target="_blank" rel="noopener noreferrer"><span>TikTok<small>Ideias e bastidores em movimento</small></span><Arrow /></a></div></section></main>
}
