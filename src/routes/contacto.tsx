import { createFileRoute, Link } from '@tanstack/react-router'
import { absolute, breadcrumbs, seo } from '~/seo'

import { Arrow } from '~/components/Editorial'

import { WHATSAPP_DISPLAY, social, whatsappLink } from '~/content'



export const Route = createFileRoute('/contacto')({ head: () => seo({
  title: 'Contacto · Quennie Interior Design',
  description: 'Fale com a Quennie pelo WhatsApp +245 956 191 086 sobre o seu projeto de interiores, mobiliário, cortinados ou estores, na Guiné-Bissau, em Portugal ou noutro país.',
  path: '/contacto',
  jsonLd: [{ '@type': 'ContactPage', name: 'Contacto', about: { '@id': absolute('/#quennie') } }, breadcrumbs([{ name: 'Contacto', path: '/contacto' }])],
}), component: ContactPage })

function ContactPage() {

  return <main>

    <section className="editorial-wrap contact-intro"><h1 className="editorial-title">Tudo começa<br /><em>com uma conversa.</em></h1><p>Uma divisão, uma casa ou um espaço de trabalho. Conte-nos o que imagina e o que precisa de mudar.</p></section>

    <section className="contact-panel"><div className="editorial-wrap contact-grid"><div><h2 className="display italic">Vamos falar<br />do seu projeto.</h2><a href={whatsappLink('Olá Quennie, gostaria de falar sobre o meu espaço.')} target="_blank" rel="noopener noreferrer" className="contact-number">{WHATSAPP_DISPLAY} <Arrow /></a><p>WhatsApp</p></div><div className="contact-options"><article><h3>Já tem uma ideia?</h3><p>Partilhe o tipo de espaço, os serviços que procura e a localização. Pode preparar o pedido antes de iniciar a conversa.</p><Link to="/orcamento" className="editorial-link">Preparar o meu pedido <Arrow /></Link></article><article><h3>Guiné-Bissau e Portugal</h3><p>Para projetos noutros países, fale com a equipa sobre a localização e o âmbito da intervenção.</p></article></div></div></section>

    <section className="editorial-wrap contact-social"><h2 className="display italic">Acompanhe<br />o que nos inspira.</h2><div><a href={social.tiktok} target="_blank" rel="noopener noreferrer">TikTok <Arrow /></a><a href={social.instagram} target="_blank" rel="noopener noreferrer">Instagram <Arrow /></a></div></section>

  </main>

}

