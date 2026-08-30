# KFS Website v4 — "David Langarica" Grade Immersive Rebuild
Plan · 2026-08-30 · Kingdom.fi

## Goal
Bring the KFS website (kingdomfiservices.com / :8081) up to the interaction grade of
davidlangarica.dev — Awwwards-caliber kinetic hero, 3D/WebGL signature, choreographed
scroll, bilingual toggle — WITHOUT losing KFS brand (Royal Gold #C9A84C on Obsidian
#05070B), compliance copy, or SEO/JSON-LD foundations already in index.html.

## What David's site actually does (the playbook)
1. **Kinetic hero** — big split-type headline ("Creative Engineer") that reveals
   character-by-character, with a scrolling availability badge + press logos.
2. **Section choreography** — pinned/scrubbed reveals, alternating full-width blocks,
   each with its own micro-animation (not one repeating card grid).
3. **3D/WebGL signature** — one bold generative/3D element per section that adds depth
   without clutter (WebGL canvas, tilts, parallax orbs).
4. **Magnetic CTAs** — buttons that pull toward cursor, elastic return.
5. **Bilingual toggle** — en/es switch, first-class (his is Spanish/English too).
6. **Clear funnel** — every section funnels to ONE action ("Book a Free Discovery Call").
7. **Distinct section identity** — no template grids; each section reads different.

## KFS mapping (what stays, what changes)
### KEEP from current index.html (do not regress)
- Design tokens: --gold #C9A84C / obsidian #05070B / fonts Cinzel+Cormorant+DM Sans+JetBrains Mono
- Compliance copy: "Results may vary", no guarantees — NEVER change
- SEO: title, meta, canonical, JSON-LD (FinancialService, Wayne NJ, +1-201-989-7108)
- Existing section content: services, 3-step ascension, testimonials, FAQ vault, contact
### CHANGE (the David-grade upgrades)
1. **Kinetic hero split-type** — "Your Kingdom." + "Your Capital." as .ch chars, stagger reveal
   + scroll-scrubbed availability line: "Serving nationwide from Wayne, NJ · Free consultation"
   + press/trust logos row (Awwwards-style badges → KFS = BBB/Google reviews/social proof)
2. **WebGL signature** — golden icosahedron + wireframe shells + particle flow-field
   (validated template flowfield-shader.js) with uOpacity fade-in, mouse repulsion,
   scroll camera drift, pause on hidden. Use the SKILL's proven stack (Three r128, pinned CDN).
3. **Preloader** — boot sequence overlay that REMOVES ITSELF (display:none after fade,
   4s failsafe) — never trap users.
4. **Magnetic buttons + spotlight tiles** — services tiles get --gx/--gy cursor spotlight,
   elastic-out magnetic CTA; funnel all to the contact/WhatsApp action.
5. **Bilingual en/es** — html lang toggle, data-en/data-es both present, apply on boot,
   brand wordmark untranslated (Spanish-first audience: default es).
6. **Film grain + scanline + marquee** ribbon ("CREDIT REPAIR · DEBT RELIEF · FUNDING ·").
7. **Section choreography** — ScrollTrigger scrubbed reveals, pinned steps section,
   parallax orbs; NOT a flat card grid.

## Security gate (mandatory before ship)
- esc() every dynamic string before innerHTML; no eval/document.write/string-setTimeout;
  no alert(); addEventListener only; rel=noopener on external links.
- Run scripts/security-scan.py from the webgl-gsap-immersive skill.

## Verification (proven recipe)
1. Static: tag-balance (Python HTMLParser), node --check on inline JS.
2. Serve :8081 locally, headless Chrome (--headless=new, virtual-time-budget 20000),
   title-harness _verify.html → grep <title> for {ready,errs,counts}.
3. Zero-console-error check; screenshots + vision_analyze visual QA (check glass panels,
   preloader dismissed, spotlight tracked).
4. prefers-reduced-motion pass kills WebGL+GSAP.
5. Scroll-preview video (puppeteer+ffmpeg) to show the user real motion.
6. Delete harness → docker compose up -d --build → verify live → git push
   (JelfferyDuran/kingdom-financial-services) → update kfs-infra CURRENT_STATE.md.

## Deliverable
Single-file rebuild (index.html, inline CSS+JS, pinned CDNs) replacing current index.html
(index-immersive.html kept as reference in repo). ~1 build session, verify, then deploy.

## Open decisions for Jayto
- [ ] Default language: Spanish-first (es) or English-first (en)? (Brand is NJ-local but
      David-style bilingual; recommend es-first per bilingual skill doctrine — confirm.)
- [ ] Primary CTA destination: phone +1-201-989-7108 · WhatsApp · cal.com-style booking?
- [ ] Which "press/social-proof" logos to feature (Google reviews, BBB, EIN/LLC, etc.)?
