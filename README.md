# Kingdom Financial Services

Public marketing website and Telegram client mini app for Kingdom Financial Services.

## Marketing website

The root site is a responsive, cinematic landing experience built with Vite, Three.js, GSAP, and progressive enhancement. It includes:

- WebGL atmosphere and scroll-linked parallax
- Interactive credit, debt, and business-funding goal pathfinder
- Accessible mobile navigation and FAQ controls
- Consultation intake through Web3Forms
- Reduced-motion support and static fallbacks

Public-site security controls include a restrictive content policy, integrity-checked third-party scripts, referrer limits, spam-resistant form fields, and hardened Netlify/Nginx response headers. Never place tax identifiers, credentials, exact mailing-suite details, or client data in this public repository.

Run locally with `npm run dev` and verify a production build with `npm run build`.

## Client mini app

The multi-client Telegram dashboard lives in `miniapp/`. Read `AGENTS.md` before modifying it; this repository is public and its PII restrictions are mandatory.
