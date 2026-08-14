# Supabase — kfs-core (one project, many apps)

Shared Supabase project pattern for KFS. **One free project = unlimited apps** —
every app gets its own Postgres **schema** (its "folder"), so we never pay per
database slot again.

## Layout

```
supabase/
├── README.md
└── kfs-core/
    ├── espinal_schema.sql   ← Case-dossier schema (schema: espinal)
    └── espinal_seed.sql     ← Case 001 seed data
```

Add a new app: create `<app>_schema.sql` here (all tables qualified to
`"<app>".*`), then apply (below). Every schema gets Row-Level Security:
anon = read-only, writes via service role only.

## Applying (no dashboard SQL editor needed)

```bash
# 1. Link once (needs the project ref + db password or management token)
npx --yes supabase@latest link --project-ref <REF>

# 2. Push this repo's migrations
npx --yes supabase@latest db push

# …or apply a single schema file directly via the Management API:
python3 /opt/data/scripts/kfs_deploy.py supabase schema <REF> espinal \
  --sql supabase/kfs-core/espinal_schema.sql
```

## Client connection

```js
import { createClient } from '@supabase/supabase-js';
const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  db: { schema: 'espinal' },   // ← the app's folder
});
```

## Rules

- Never commit `SUPABASE_SERVICE_ROLE_KEY` — service role stays in server env only.
- Anon key is read-only by design (RLS `for select using (true)`; no write policies).
- Repo is public → no secrets, no PII, no real account numbers in seeds.
- Project slots: free plan = 2 **active** projects per user. Keep old/unused
  projects **paused** so new ones can be created. See /opt/data/ECOSYSTEM.md.
