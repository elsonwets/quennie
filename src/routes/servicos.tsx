import { createFileRoute, Link } from '@tanstack/react-router'
import { absolute, breadcrumbs, seo } from '~/seo'

import { Arrow } from '~/components/Editorial'
import { SpatialHero, SpatialDepth, SpatialReveal, SpatialClosing, Lines, Reveal } from '~/components/Spatial'

import { services } from '~/content'



export const Route = createFileRoute('/servicos')({ head: () => seo({
  title: 'Design de interiores, mobiliário e remodelações · Quennie',
  description: 'Design de interiores, remodelações, mobiliário por medida, cortinados e estores para casas, escritórios, hotéis e restaurantes na Guiné-Bissau e em Portugal.',
  path: '/servicos',
  jsonLd: [
    {
      '@type': 'ItemList',
      name: 'Serviços Quennie',
      itemListElement: services.map((service, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: { '@type': 'Service', name: service.name, description: service.text, provider: { '@id': absolute('/#quennie') } },
      })),
    },
    breadcrumbs([{ name: 'Serviços', path: '/servicos' }]),
  ],
}), component: ServicesPage })

const details = [

  { line: 'Um espaço pensado como um todo.', body: 'Da disposição do mobiliário à relação entre luz, materiais e cor. Começamos por perceber como vive o espaço para desenhar uma proposta coerente com o seu dia a dia.', items: ['Organização do espaço', 'Materiais, cores e iluminação', 'Estudo e visualização em 3D'] },

  { line: 'A medida certa faz a diferença.', body: 'Mobiliário pensado para se integrar na arquitetura e na forma como usa cada divisão. Proporção, arrumação e acabamentos fazem parte da mesma conversa.', items: ['Mobiliário por medida', 'Soluções de arrumação', 'Escolha de materiais e acabamentos'] },

  { line: 'A luz também se desenha.', body: 'Cortinados e estores que equilibram luz, privacidade e conforto. O tecido e a forma de instalação são escolhidos em função de cada espaço.', items: ['Cortinados personalizados', 'Estores por medida', 'Tecidos, pregas e instalação'] },

  { line: 'Dar uma nova leitura ao que existe.', body: 'Uma remodelação começa por identificar o que o espaço pode fazer melhor. Integramos as escolhas de interiores, mobiliário e acabamentos numa proposta para a sua transformação.', items: ['Casas e espaços comerciais', 'Hotelaria e restauração', 'Interiores e acabamentos'] },

]

function ServicesPage() {
  return <main className="interior-page services-page">
    <SpatialHero title="Uma visão." emphasis="Por inteiro." description="Design de interiores, mobiliário, cortinados e remodelações. Uma intervenção ou um conceito completo, pensado à sua medida." image="/media/7673552471175875858-01.webp" imageAlt="Estudo de interiores publicado pela Quennie" caption="Estudo de interiores · Publicação Quennie">
      <a href="#design" className="spatial-text-link">Explorar os serviços <Arrow /></a>
    </SpatialHero>
    <nav className="service-index" aria-label="Áreas de intervenção">{services.map((service,i)=><a key={service.name} href={`#${i===0?'design':`service-${i}`}`}>{service.name}<Arrow /></a>)}</nav>
    <div className="interior-chapters">{services.map((service,index)=><section key={service.name} id={index===0?'design':`service-${index}`} className="interior-service">
      <SpatialReveal className="interior-service-copy"><h2>{service.name}</h2><p className="interior-service-line">{details[index].line}</p><p>{details[index].body}</p><ul>{details[index].items.map(item=><li key={item}>{item}</li>)}</ul><Link to="/orcamento" search={{servico:service.name}} className="spatial-text-link">Falar sobre este serviço <Arrow /></Link>{index===2&&<Link to="/cortinados" className="spatial-secondary-link">Explorar tecidos e pregas</Link>}</SpatialReveal>
      <Reveal as="figure" kind="arch"><SpatialDepth><img src={service.image} alt={`Publicação Quennie: ${service.name}`} loading="lazy" /></SpatialDepth><figcaption>Publicação original da Quennie</figcaption></Reveal>
    </section>)}</div>
    <section className="interior-service-scope"><Lines lines={['Espaços para viver.', <em key="e">E para receber.</em>]} /><Reveal as="p">Casas · Escritórios · Hotelaria · Restauração</Reveal></section><SpatialClosing />
  </main>
}
