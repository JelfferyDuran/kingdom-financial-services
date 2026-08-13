-- ============================================================================
-- Kingdom Hermes — multi-client progress sync (run ONCE in Supabase SQL editor)
-- Project: rckqjverdckszsrzjkzs.supabase.co (same project as cesar-cr-tracker)
-- Applies after: miniapp v2.2 deployed. Then set SUPABASE_ENABLED=true in
-- miniapp/index.html and push — progress checkmarks sync to the cloud per client.
-- ============================================================================

-- 1) Each KFS client profile is identified by a slug (anthony-duran, cesar-larancuent…)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS slug text UNIQUE;

-- Seed slugs for the two known clients (emails are masked — fill the real ones,
-- or have each client sign in once and update their row):
-- UPDATE public.profiles SET slug = 'cesar-larancuent' WHERE email = '<cesar-email>';
-- UPDATE public.profiles SET slug = 'anthony-duran'    WHERE email = '<anthony-email>';
-- UPDATE public.profiles SET slug = 'general'          WHERE email = '<noel-email>';

-- 2) Per-client progress table (step checkmarks, cloud-synced)
CREATE TABLE IF NOT EXISTS public.client_progress (
  client_slug text NOT NULL,
  step_id     text NOT NULL,
  done        boolean NOT NULL DEFAULT false,
  updated_at  timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (client_slug, step_id)
);

ALTER TABLE public.client_progress ENABLE ROW LEVEL SECURITY;

-- RLS: any authenticated user may read/write progress ONLY for their own client.
CREATE POLICY "client_progress_select_own" ON public.client_progress
  FOR SELECT USING (
    client_slug = (SELECT slug FROM public.profiles WHERE id = auth.uid())
  );

CREATE POLICY "client_progress_insert_own" ON public.client_progress
  FOR INSERT WITH CHECK (
    client_slug = (SELECT slug FROM public.profiles WHERE id = auth.uid())
  );

CREATE POLICY "client_progress_update_own" ON public.client_progress
  FOR UPDATE USING (
    client_slug = (SELECT slug FROM public.profiles WHERE id = auth.uid())
  );

-- 3) Give authenticated users a read on their own profile slug (needed by the app)
CREATE POLICY "profiles_read_own" ON public.profiles
  FOR SELECT USING (id = auth.uid());

-- Verify: SELECT slug FROM profiles;  SELECT * FROM client_progress LIMIT 5;
