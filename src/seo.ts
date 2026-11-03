import type { DetailedHTMLProps, MetaHTMLAttributes } from 'react'
import { WHATSAPP_NUMBER, social } from './content'

type Meta = DetailedHTMLProps<MetaHTMLAttributes<HTMLMetaElement>, HTMLMetaElement>

/**
 * Public origin of the site, e.g. https://www.quennie.pt. Set VITE_SITE_URL at build time so
 * canonical URLs and social previews are absolute; without it they fall back to relative paths.
 */
export const SITE_URL = (import.meta.env.VITE_SITE_URL ?? '').replace(/\/$/, '')
export const SITE_NAME = 'Quennie Home Concept & Interior Design'
const DEFAULT_IMAGE = '/images/og-quennie.jpg'

export const absolute = (path: string) => (path.startsWith('http') ? path : `${SITE_URL}${path}`)

/** Every indexable page, with what search engines should know about it. */
export const pages = [
  { path: '/', priority: 1, changefreq: 'weekly' },
  { path: '/servicos', priority: 0.9, changefreq: 'monthly' },
  { path: '/cortinados', priority: 0.9, changefreq: 'monthly' },
  { path: '/projetos', priority: 0.8, changefreq: 'weekly' },
  { path: '/contacto', priority: 0.7, changefreq: 'yearly' },
  { path: '/orcamento', priority: 0.7, changefreq: 'yearly' },
] as const

type SeoInput = {
  title: string
  description: string
  path: string
  image?: string
  imageAlt?: string
  type?: 'website' | 'article'
  jsonLd?: Record<string, unknown>[]
}

/** Title, description, Open Graph, Twitter and structured data for a route's `head()`. */
export function seo({ title, description, path, image = DEFAULT_IMAGE, imageAlt, type = 'website', jsonLd = [] }: SeoInput) {
  const url = absolute(path)
  const img = absolute(image)
  const meta: Meta[] = [
    { title },
    { name: 'description', content: description },
    { property: 'og:site_name', content: SITE_NAME },
    { property: 'og:locale', content: 'pt_PT' },
    { property: 'og:type', content: type },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: url },
    { property: 'og:image', content: img },
    { property: 'og:image:alt', content: imageAlt ?? title },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: img },
    // The router renders `script:ld+json` entries as JSON-LD; its meta typings don't list the key.
    ...jsonLd.map((data) => ({ 'script:ld+json': { '@context': 'https://schema.org', ...data } }) as Meta),
  ]
  return { meta, links: SITE_URL ? [{ rel: 'canonical', href: url }] : [] }
}

export function breadcrumbs(trail: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: 'Início', path: '/' }, ...trail].map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absolute(item.path),
    })),
  }
}

/** The studio itself. Only facts confirmed in PRODUCT.md: no address, hours or ratings. */
export const business = {
  '@type': 'HomeAndConstructionBusiness',
  '@id': absolute('/#quennie'),
  name: SITE_NAME,
  alternateName: 'Quennie',
  description:
    'Estúdio de design de interiores, remodelações, fabrico de mobiliário à medida, cortinados e estores para casas, espaços comerciais, hotelaria e restauração.',
  url: absolute('/'),
  logo: absolute('/favicon.svg'),
  image: absolute(DEFAULT_IMAGE),
  telephone: `+${WHATSAPP_NUMBER}`,
  areaServed: [
    { '@type': 'Country', name: 'Guiné-Bissau' },
    { '@type': 'Country', name: 'Portugal' },
    { '@type': 'Country', name: 'Senegal' },
  ],
  knowsAbout: ['Design de interiores', 'Remodelações', 'Mobiliário à medida', 'Cortinados', 'Estores'],
  sameAs: [social.instagram, social.tiktok],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    telephone: `+${WHATSAPP_NUMBER}`,
    availableLanguage: ['Portuguese'],
    url: `https://wa.me/${WHATSAPP_NUMBER}`,
  },
}

export const website = {
  '@type': 'WebSite',
  '@id': absolute('/#website'),
  name: SITE_NAME,
  url: absolute('/'),
  inLanguage: 'pt',
  publisher: { '@id': absolute('/#quennie') },
}

/** TikTok ids carry their publish time in the top 32 bits (seconds since epoch). */
export function tiktokDate(id: string) {
  return new Date(Number(BigInt(id) >> 32n) * 1000).toISOString()
}
