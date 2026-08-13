# Kingdom Hermes — Telegram Mini App (multi-client)

Command launcher + live dashboard for KFS clients and Hermes sessions, opened inside Telegram.

## Live URL
`https://jelfferyduran.github.io/kingdom-financial-services/miniapp/`

## Clients
- **Anthony Duran** — Credit Report Dashboard (default): student-loan MOV campaign,
  action plan with interactive checklist, accounts, flags.
- **César Larancuent** — Centro de Control de Crédito (Spanish).
- **General** — Noel's all-sessions workspace.

Add clients via `data/clients.json` + `data/clients/<slug>.json` — see `AGENTS.md` at repo root.

## How it works (Tier 1)
- **Read-only dashboard**: per-client JSON fetched on open (embedded fallback offline).
- **Commands**: tap → copied to clipboard → **Open Chat** → paste into the Hermes chat.
- **🧠 Send Context to Hermes**: copies the full client context bundle (profile, negative
  items, action-plan progress, flags) so the agent picks up exactly where the dashboard left off.
- **Action Plan**: interactive checklist; progress persists per device; plan summary copies
  to the chat so the agent updates the campaign tracker.
- **`sendData`**: when opened in Telegram, the app also emits `web_app_data` for future
  native round-trip support (Tier 2).

## Data
- `miniapp/data/clients.json` — client manifest
- `miniapp/data/clients/<slug>.json` — per-client data (schema in AGENTS.md)
- `miniapp/scripts/update_snapshot.py` — refreshes timestamps + pushes (daily cron)

## Deploy
Push to `main` → GitHub Pages publishes automatically (branch deploy, no build).
