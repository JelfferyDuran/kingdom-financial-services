# Kingdom Hermes — Telegram Mini App

A command launcher + live dashboard for your Hermes sessions, opened inside Telegram.

## Live URL
`https://jelfferyduran.github.io/kingdom-financial-services/miniapp/`

## How it works (Tier 1)
- **Read-only dashboard**: `data.json` is fetched on open (with embedded fallback if offline).
- **Commands**: tap any quick command (or type your own) → it's copied to the clipboard →
  tap **Open Chat** → paste into the Hermes chat → the agent runs it.
- **`sendData`**: when opened in Telegram, the Mini App also emits a `web_app_data`
  payload for future native round-trip support (Tier 2).

## Editing data
Edit `miniapp/data.json` and push — the snapshot `updatedAt` refreshes.
Quick commands can also be customized per-device inside the app (✏️ Edit).

## Automation
`miniapp/scripts/update_snapshot.py` refreshes `updatedAt` and pushes.
Scheduled as a Hermes cron job (daily) so the dashboard always shows a fresh snapshot.

## Roadmap (Tier 2)
- Hermes Telegram adapter support for `web_app_data` → true button-to-agent round trip.
- Live session list pulled from the Hermes session store.
- Push relay for scheduled digests into the Mini App.
