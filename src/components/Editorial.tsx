import { MediaImage } from './MediaImage'
import { Link } from '@tanstack/react-router'

import { img } from '~/content'



export function Arrow({ className = 'h-4 w-8' }: { className?: string }) {

  return <svg aria-hidden="true" viewBox="0 0 32 16" className={className} fill="none"><path d="M0 8h30m-7-7 7 7-7 7" stroke="currentColor" /></svg>

}



export function AmbientImage({ image, alt, className = '' }: { image: string; alt: string; className?: string }) {

  return <figure className={className}><MediaImage src={img(image, 1600)} alt={alt} /><figcaption className="mt-3 text-xs text-taupe">{image.startsWith('/') ? 'Publicação da Quennie' : 'Imagem de ambiente · inspiração'}</figcaption></figure>

}



export function PageClosing({ title = 'Vamos pensar o seu espaço?' }: { title?: string }) {

  return <section className="editorial-wrap editorial-closing"><h2 className="display italic">{title}</h2><Link to="/orcamento" className="editorial-link">Pedir orçamento <Arrow /></Link></section>

}

