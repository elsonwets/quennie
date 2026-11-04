# Quennie — Spatial edition

Direction: an immersive interior-design gallery, preserving the studio's Portuguese content and original publications. The home opens directly on a full-bleed interior photograph, monumental Cormorant lettering and a transparent navigation bar. Olive, linen and walnut derive from the established brand palette; spatial tokens use OKLCH in src/styles.css.

The home journey is studio philosophy, an asymmetric publication gallery, selectable services, the three-step process, dimensional material studies, the existing curtain simulator on demand, original videos and a quote invitation. Illustrative photography is explicitly labelled; no invented project or client claims.

Motion: measured headline reveal, scroll parallax and spring-smoothed pointer tilt. The material composition uses layered CSS 3D transforms and local linen photography, with no additional rendering dependency. Reduced motion disables the new reveal, parallax and tilt. Touch users receive a static composition. The existing curtain experience remains available.

Shared header: solid linen on interior pages and after scrolling, full mobile navigation, Escape dismissal and a skip link. Keep local imagery uncropped where it contains original captions. Existing quote, WhatsApp, contact and service routes remain intact.

Implementation: src/routes/index.tsx, src/components/SiteHeader.tsx, spatial-prefixed rules in src/styles.css. The previous curtain hero components remain in the repository but are not mounted on the redesigned home.
