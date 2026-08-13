# AGENTS.md — Kingdom Hermes Mini App (kingdom-financial-services)

> This file is the operating manual for **any agent** (Hermes, Claude Code, Codex) working
> on the KFS Telegram Mini App. Read it before touching the repo.

## What this is

A **multi-client Telegram Mini App** ("Kingdom Hermes") — a command launcher + live
dashboard for KFS clients and general Hermes sessions. Opened inside Telegram via the
**⚡ Kingdom Hermes** menu button on `@kingdomfi_bot`.

- **Live URL:** https://jelfferyduran.github.io/kingdom-financial-services/miniapp/
- **Host repo:** `JelfferyDuran/kingdom-financial-services` (PUBLIC — see PII rule below)
- **Hosting:** GitHub Pages, "Deploy from a branch" → `main` / root. Push to main = instant publish. No build step.
- **Telegram:** menu button + welcome message wired via Bot API (`setChatMenuButton`, inline `web_app` button). Bot token lives in `/opt/data/.env` (`TELEGRAM_BOT_TOKEN`). Bot username: `kingdomfi_bot`.

## Repository layout

```
AGENTS.md                        ← you are here
miniapp/
  index.html                     ← single-file SPA (no build). Multi-client shell.
  README.md                      ← user-facing overview
  data/
    clients.json                 ← client manifest (slug, name, title, file, default)
    clients/
      <slug>.json                ← per-client data (schema below)
  scripts/
    update_snapshot.py           ← refreshes updatedAt on all data files + pushes (cron)
```

## Client data schema (`data/clients/<slug>.json`)

```jsonc
{
  "slug": "anthony-duran",          // kebab-case, unique; matches filename
  "name": "Anthony R Duran Martinez", // full legal name
  "display": "Anthony Duran",        // short label for chips
  "title": "Credit Report Dashboard",// subtitle under app name
  "lang": "en",                      // or "es"
  "updatedAt": "ISO-8601",           // refreshed by update_snapshot.py — do not hand-edit casually
  "profile": { "role", "reportDate", "reportSource", "history", "location", "employer", "piiNote" },
  "credit": {
    "scores": { "TU": 683, "EX": 675, "EFX": 620 } | null,   // null when report has no scores
    "scoresTarget": 720 | null,   // OPTIONAL — target score tick on the gauges
    "scoresNote": "string",
    "negative": [ { "creditor", "account", "opened", "type", "balance", "pastDue",
                    "rating", "dofd", "lastPayment", "removalEst", "strategy" } ],
    "openAccounts": [ { "creditor", "type", "balance", "limit", "opened", "note" } ],
    "closedPositive": "free text",
    "inquiries": { "experianHard", "tu", "eq" }
  },
  "flags": [ { "emoji", "text", "meta" } ],
  "actionPlan": {
    "campaign": "string", "packDate", "round": 1,
    "method": "string",
    "steps": [ { "id": "l1", "label", "status": "pending|done", "meta" } ],
    "deadlines": [ { "label", "days" } ],
    "disputePoints": [ "string" ]
  },
  "quickCommands": [ { "emoji", "label", "cmd" } ],
  "sessions": [ { "title", "who", "when", "cmd" } ],
  "financial": [ { "label", "value", "fmt", "kind": "pos|neg|neutral", "goal?", "note?" } ]
}
```

## UI (v2.1 — interactive dashboard)

- **🎯 Next-Step hero**: the first incomplete action-plan step renders as a pinned card under the client bar with a live progress ring, "Mark Done" and "Ask Hermes" (sends the step as a command). All steps done → celebration card + copy-status button. Driven entirely by `actionPlan.steps` + per-device localStorage checkmarks.
- **📊 Score gauges**: when `credit.scores` is present, each bureau renders as an SVG donut with a VantageScore 3.0 band label (Excellent/Good/Fair/Poor/Very Poor) and an optional white tick at `scoresTarget`. No scores → `scoresNote` shows instead.
- **🔴 Negative cards**: tap to expand → full per-bureau details + strategy + 3 action buttons (Draft letter / MOV / Copy details) that send tailored commands. Expanded state remembered per device.
- **⚡ Per-step ask buttons**: every action-plan step has a ⚡ button that sends a self-contained "execute this step" command.
- **🌐 i18n**: fixed labels translate for `lang: "es"` (César). Data text stays as authored.
- **💡 Tap-to-copy accounts**: tapping an open account copies a "check status" command. All sections animate in (`.reveal`).
- Commands are emitted via `send()` → `tg.sendData` (when inside Telegram) + clipboard fallback, so they work as copy-paste even without the adapter round-trip.

## Adding a new client (the workflow)

1. **Create the data file** — `miniapp/data/clients/<slug>.json` using the schema above.
   Seed from the client's credit reports / Supabase export / existing tracker.
2. **Register in the manifest** — add an entry to `miniapp/data/clients.json`
   (`default: false` unless it should be the first screen).
3. **Create a client branch** (per-client isolation convention):
   `git checkout -b client/<slug>` from `main`, commit the data file, push.
   The branch carries that client's data + any client-specific tweaks.
4. **Push `main`** so the app serves the new client.
5. **Update Telegram copy** (optional): welcome message, bot description.
6. **Tell the agents**: record the client slug in the relevant Hermes memory / notes.

Existing branches: `client/anthony-duran`, `client/cesar-larancuent`.

## How data stays fresh

- **Cron:** daily 09:00 UTC job runs `miniapp/scripts/update_snapshot.py`
  (wrapper: `/opt/data/scripts/update_kingdom_hermes_snapshot.py`) → refreshes all
  `updatedAt` timestamps, commits, pushes. Silent when nothing changed.
- **Manual:** any agent may edit `data/clients/*.json` directly and push — the miniapp
  picks changes up on next open (fetch with cache-busting; embedded fallback offline).
- **Real sources (local VPS, NOT in this repo):**
  - Credit reports + analyses: `/opt/data/finance/credit/`
  - Anthony MOV pack: `/opt/data/finance/credit/dispute-letters-2026-08/anthony_mov/`
  - Jeff's campaign tracker: `/opt/data/finance/credit/dispute-letters-2026-08/CAMPAIGN_TRACKER.md`
  - Obsidian vault (KFS KB): `/opt/data/obsidian-vault-git/01 - KFS/`

## Agent conventions

- **Always load the relevant skills first:**
  - `credit-report-analysis` — parsing 3-bureau reports, reconciliation, dashboard format
  - `soydaat-fcra-disputes` — 3-round dispute framework, letter library, deadlines
  - `github-pages-hardening` — Pages deploy patterns and pitfalls
- **PII rule (non-negotiable):** this repo is **public**. Never commit DOB, full SSN,
  full street addresses, or unmasked account numbers into `data/` or any file. Mask
  account numbers (`…0420`), keep identity data in local paths (see above). The schema
  field `profile.piiNote` documents where full PII lives.
- **Dispute letters:** USPS Certified Mail + Return Receipt required; log tracking
  numbers in the campaign tracker the day they're mailed; start 30-day clocks from
  DELIVERY date, not send date.
- **Federal student loans** (Dept of Ed/Aidvantage) are NOT deletion targets — the path
  is cure delinquency + accuracy dispute of wrong data points, never FCRA deletion.
- **Numbers in the app must reconcile** with the source reports; when updating
  balances/status, update the tracker + data file together.
- **Language:** César's dashboard is Spanish-first (`lang: "es"`); Anthony's and
  General are English.

## Deployment & verification

```bash
# after editing: commit + push main → Pages publishes within ~1 min
curl -s -o /dev/null -w '%{http_code}\n' https://jelfferyduran.github.io/kingdom-financial-services/miniapp/
# verify data:
curl -s https://jelfferyduran.github.io/kingdom-financial-services/miniapp/data/clients.json
```

- Pages source: branch `main`, root `/` (set in repo Settings → Pages).
- The GitHub PAT used by agents **cannot** create repos, enable Pages, or push
  workflows (no repo-create / Pages / workflow scopes) — deploy into this repo only.

## Roadmap (Tier 2)

- `web_app_data` round-trip in the Hermes Telegram adapter → buttons send commands
  directly (no copy-paste).
- Live session list from the Hermes session store (`state.db`).
- Optional Supabase backend (like `cesar-cr-tracker`) for auth + per-client DB.
