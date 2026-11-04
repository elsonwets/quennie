# Quennie — Spatial edition

Direction: an immersive interior-design gallery, preserving the studio's Portuguese content and original publications. The home opens directly on a full-bleed interior photograph, monumental Cormorant lettering and a transparent navigation bar. Olive, linen and walnut derive from the established brand palette; spatial tokens use OKLCH in src/styles.css.

The home journey is studio philosophy, an asymmetric publication gallery, selectable services, the three-step process, dimensional material studies, the existing curtain simulator on demand, original videos and a quote invitation. Illustrative photography is explicitly labelled; no invented project or client claims.

Motion: measured headline reveal, scroll parallax and spring-smoothed pointer tilt. The material composition uses layered CSS 3D transforms and local linen photography, with no additional rendering dependency. Reduced motion disables the new reveal, parallax and tilt. Touch users receive a static composition. The existing curtain experience remains available.

Shared header: solid linen on interior pages and after scrolling, full mobile navigation, Escape dismissal and a skip link. Keep local imagery uncropped where it contains original captions. Existing quote, WhatsApp, contact and service routes remain intact.

Implementation: src/routes/index.tsx, src/components/SiteHeader.tsx, spatial-prefixed rules in src/styles.css. The previous curtain hero components remain in the repository but are not mounted on the redesigned home.

## Signature — "A janela"

The window is the brand's spatial motif (curtains, light, arched openings).

- **Arrival** (home, fresh page load only): two photographic linen panels and a seam of daylight, then the drapes part on the room (~2.2 s). Pure CSS, so it never waits for JavaScript; it is skipped on in-app navigation to the home page and hidden under reduced motion.
- **The arch**: the full-bleed room steps back into an arched window as the studio's claim is set around it ("Uma casa não é apenas um lugar." / "É uma forma de ser."). CSS scroll timelines on a sticky stage: side columns on wide screens, the claim beneath a tall window on phones. Without scroll-timeline support, or with reduced motion, it is a plain hero followed by the claim.
- **Reveal grammar**: headings rise line by line out of masks (`Lines`), blocks rise (`Reveal`), images open from an arch (`Reveal kind="arch"`). Only elements that start below the fold are hidden, and only from their own effect after hydration, so server HTML, no-JS and reduced-motion visitors always see the content.
- Supporting motion: velocity marquee of the services on the olive band, scroll depth between the material layers, the footer wordmark rising into place.

Implementation notes (each of these has bitten once):
- `html` has `scroll-padding-top`, which view timelines inherit; every `view-timeline` / `view()` sets its inset to 0.
- Always name the animation inside the `animation` shorthand: the CSS minifier rewrites a nameless shorthand to `animation:none` in production.
- The "Entre" anchor lives outside the sticky stage; inside it, its position would depend on the scroll position.
- The header height is the `--header-h` token; interior pages are offset by `.page-offset`.
