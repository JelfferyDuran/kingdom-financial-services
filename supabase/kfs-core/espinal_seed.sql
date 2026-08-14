-- Adapted for shared kfs-core project (schema: espinal)
-- ============================================================
-- Seed: Case 001 — The Espinal Case
-- Run AFTER schema.sql in the Supabase SQL editor.
-- ============================================================

insert into "espinal"."cases" (slug, title, victim, defendant, jurisdiction, status, summary, timeline, sources)
values (
  'case-001-espinal',
  'The Espinal Case — Alyne Silva Espinal',
  'Alyne Silva Espinal, 46 (Brazilian-born; mother & grandmother)',
  'Ignacio Espinal, 55 (husband, married July 2025)',
  'Somerville, Somerset County, New Jersey — USA',
  'active',
  'Alyne Silva Espinal (46) was found dead on Aug 6, 2026 in her Brookside Gardens apartment (60 Brookside Ave, Apt 3B), Somerville NJ, with multiple lacerations to chest, neck and thigh; ruled a homicide by the Northern Regional ME. Her husband Ignacio Espinal (55) was arrested Aug 11, 2026 in West New York NJ and charged with first-degree murder, third-degree possession of a weapon for an unlawful purpose, and third-degree hindering. Court documents show a hatchet purchased ~4 weeks prior, surveillance of him driving her vehicle, suspected blood in the vehicle, and an alleged attempt to mop up blood at the scene. Held at Somerset County Jail pending a detention hearing as of Aug 13, 2026.',
  '[
    {"when":"early July 2026","what":"Hatchet purchased at local hardware store (store surveillance) per Affidavit of Probable Cause"},
    {"when":"Jul 13 2026","what":"Alyne posts beach selfie: one year earlier was the day before their wedding"},
    {"when":"Aug 4 2026","what":"Alyne''s final Facebook post — Brazilian-flag tee, quote about becoming the best version of yourself"},
    {"when":"Aug 6 2026 (early AM)","what":"Fatal attack believed to have occurred"},
    {"when":"Aug 6 2026 7:26 PM","what":"911 welfare check; Alyne found dead; hatchet with suspected blood recovered"},
    {"when":"Aug 11 2026","what":"Ignacio Espinal arrested in West New York; charged with murder + weapon + hindering"},
    {"when":"Aug 12 2026","what":"Prosecutor''s office announces charges; held at Somerset County Jail pending detention hearing"}
  ]'::jsonb,
  '[
    {"pub":"Fox News","url":"https://www.foxnews.com/us/nj-woman-found-multiple-stab-wounds-home-affluent-county-husband-arrested"},
    {"pub":"Patch (Bridgewater)","url":"https://patch.com/new-jersey/bridgewater/husband-bought-hatchet-4-weeks-slashing-murder-wife-somerville-report"},
    {"pub":"NJ.com","url":"https://www.nj.com/somerset/2026/08/man-charged-with-killing-wife-46-in-nj-town.html"},
    {"pub":"MyCentralJersey / AOL","url":"https://www.aol.com/articles/somerville-man-charged-murder-wife-155540000.html"},
    {"pub":"NJ101.5","url":"https://nj1015.com/somerville-domestic-homicide-case/"},
    {"pub":"Daily Voice","url":"https://dailyvoice.com/article/ignacio-espinal-stabbed-wife-to-death-prosecutor/"},
    {"pub":"Somerset County Prosecutor''s Office","url":"https://www.facebook.com/100064727857770/posts/1514629950704586/"}
  ]'::jsonb
)
on conflict (slug) do nothing;

-- Pre-seed the first development we are tracking (detention hearing pending).
insert into "espinal"."case_updates" (case_id, occurred_on, headline, detail, source_url)
select id, '2026-08-13', 'Detention hearing pending; case in early stages',
       'As of Aug 13, 2026 no hearing outcome or indictment publicly reported. Weekly tracker monitoring.',
       'https://patch.com/new-jersey/bridgewater/husband-bought-hatchet-4-weeks-slashing-murder-wife-somerville-report'
from "espinal"."cases" where slug = 'case-001-espinal';
