import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

export function getRouter() {
  return createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: 'intent',
    // Pages part like drapes; see ::view-transition rules in styles.css.
    defaultViewTransition: true,
  })
}
