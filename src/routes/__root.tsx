import type { ReactNode } from 'react'
import { HeadContent, Outlet, Scripts, createRootRoute, useRouterState } from '@tanstack/react-router'
import appCss from '../styles.css?url'
import { business, website } from '~/seo'
import { CurtainIntroProvider } from '~/components/CurtainIntro'
import { SiteHeader } from '~/components/SiteHeader'
import { SiteFooter } from '~/components/SiteFooter'
import { WhatsAppButton } from '~/components/WhatsAppButton'
import { SmoothScroll } from '~/components/motion/SmoothScroll'
import { FabricLayer } from '~/components/gl/FabricLayer'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'theme-color', content: '#efe8df' },
      { name: 'format-detection', content: 'telephone=no' },
      // Site-wide identity; each route adds its own page-level data.
      { 'script:ld+json': { '@context': 'https://schema.org', '@graph': [business, website] } },
    ],
    links: [
      { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
      { rel: 'icon', href: '/favicon.ico', sizes: '48x48' },
      { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      { rel: 'manifest', href: '/site.webmanifest' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@300;400;500&display=swap',
      },
      { rel: 'stylesheet', href: appCss },
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  return (
    <RootDocument>
      <CurtainIntroProvider key={pathname} isHome={pathname === '/'}>
      <SmoothScroll />
      <SiteHeader />
      {/* Clears the fixed header. */}
      <div className={pathname === '/' ? '' : 'page-offset'} id={pathname === '/' ? undefined : 'main-content'}>
        <Outlet />
      </div>
      <SiteFooter />
      <WhatsAppButton />
      <FabricLayer />
      </CurtainIntroProvider>
    </RootDocument>
  )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="pt">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}


