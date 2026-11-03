import { createFileRoute, Link } from '@tanstack/react-router'
import { absolute, breadcrumbs, seo } from '~/seo'

import { AmbientImage, Arrow, PageClosing } from '~/components/Editorial'

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

  return <main>

    <section className="editorial-wrap service-intro"><h1 className="editorial-title">O seu espaço.<br /><em>A nossa forma<br />de o pensar.</em></h1><div className="service-intro-copy"><p>Design de interiores, mobiliário, cortinados e remodelações. Escolha uma intervenção ou pense connosco o conjunto.</p><a href="#design" className="editorial-link">Explorar os serviços <Arrow /></a></div></section>

    <div className="service-spread"><AmbientImage image="/media/7673552471175875858-01.webp" alt="Estudo de interiores publicado pela Quennie" /></div>

    <div className="editorial-wrap service-chapters">{services.map((service, index) => <section key={service.name} id={index === 0 ? 'design' : undefined} className="service-chapter"><div><h2 className="display italic">{service.name}</h2><p className="service-line">{details[index].line}</p></div><div><p className="editorial-body">{details[index].body}</p><ul className="service-inclusions">{details[index].items.map(item => <li key={item}>{item}</li>)}</ul><Link to="/orcamento" search={{ servico: service.name }} className="editorial-link">Falar sobre este serviço <Arrow /></Link>{index === 2 && <Link to="/cortinados" className="mt-6 block text-sm underline underline-offset-4">Explorar tecidos e pregas</Link>}</div></section>)}</div>

    <section className="service-dark"><div className="editorial-wrap"><h2 className="display italic">Da casa ao espaço<br />que recebe os outros.</h2><p>Casas · Espaços comerciais · Hotelaria · Restauração</p></div></section><PageClosing />

  </main>

}

