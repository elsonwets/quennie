import { createFileRoute } from '@tanstack/react-router'
import media from '~/quennie-media.json'
import { pages, SITE_URL, tiktokDate } from '~/seo'

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: ({ request }) => {
        const origin = SITE_URL || new URL(request.url).origin
        // The journal changes whenever a new publication is imported.
        const latest = media.map((post) => tiktokDate(post.id)).sort().at(-1)
        const urls = pages
          .map(
            (page) => `  <url>
    <loc>${origin}${page.path}</loc>${page.path === '/projetos' && latest ? `\n    <lastmod>${latest.slice(0, 10)}</lastmod>` : ''}
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority.toFixed(1)}</priority>
  </url>`,
          )
          .join('\n')
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
        return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } })
      },
    },
  },
})
