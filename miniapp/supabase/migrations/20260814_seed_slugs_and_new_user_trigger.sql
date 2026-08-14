-- ============================================================================
-- Kingdom Hermes — seed client slugs + auto-profile trigger (run ONCE, after
-- 20260813_enable_multi_client_progress.sql). Project: rckqjverdckszsrzjkzs.
-- 1) Maps the two existing sign-in emails to their client slugs.
-- 2) Auto-creates a profiles row for ANY new magic-link sign-in, and
--    auto-assigns the slug when the email is a known client (add new client
--    emails to the CASE below — see AGENTS.md "Mapping a new client email").
-- ============================================================================

-- 1) Seed slugs for profiles that already exist (from cesar-cr-tracker)
UPDATE public.profiles SET slug = 'cesar-larancuent'
  WHERE email = 'cesarlarancuent63@gmail.com' AND slug IS NULL;

UPDATE public.profiles SET slug = 'general'
  WHERE email = 'jelfferyduran@gmail.com' AND slug IS NULL;

-- 2) Auto-create profile on signup + auto-map known client emails
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, slug)
  VALUES (
    new.id,
    new.email,
    CASE new.email
      WHEN 'cesarlarancuent63@gmail.com' THEN 'cesar-larancuent'
      WHEN 'jelfferyduran@gmail.com'     THEN 'general'
      ELSE NULL  -- unknown email: profile created; owner maps slug later
    END
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Verify:
--   SELECT email, slug FROM public.profiles;
--   SELECT * FROM public.client_progress LIMIT 5;
