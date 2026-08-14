-- Adapted for shared kfs-core project (schema: espinal)
create schema if not exists "espinal";
-- ============================================================
-- Investigation Hub — Supabase schema
-- Case 001: The Espinal Case (Somerville, NJ — Aug 2026)
--
-- Security model: RLS enabled. Public (anon) gets SELECT only.
-- Inserts/updates happen server-side with the service-role key
-- (e.g. the weekly tracker cron), NEVER with the anon key.
-- ============================================================

create extension if not exists pgcrypto;

-- ---- cases ---------------------------------------------------
create table if not exists "espinal"."cases" (
  id          bigint generated always as identity primary key,
  slug        text unique not null,
  title       text not null,
  victim      text,
  defendant   text,
  jurisdiction text,
  status      text not null default 'active',   -- active | awaiting-trial | decided | closed
  summary     text,
  timeline    jsonb not null default '[]'::jsonb,
  sources     jsonb not null default '[]'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ---- case_updates ---------------------------------------------
-- One row per development (hearing result, indictment, filing...)
create table if not exists "espinal"."case_updates" (
  id          bigint generated always as identity primary key,
  case_id     bigint not null references "espinal"."cases"(id) on delete cascade,
  occurred_on date,
  headline    text not null,
  detail      text,
  source_url  text,
  created_at  timestamptz not null default now()
);

create index if not exists case_updates_case_idx on "espinal"."case_updates"(case_id, occurred_on desc);

-- ---- row level security ---------------------------------------
alter table "espinal"."cases"        enable row level security;
alter table "espinal"."case_updates" enable row level security;

drop policy if exists "public read cases"   on "espinal"."cases";
drop policy if exists "public read updates" on "espinal"."case_updates";

create policy "public read cases"   on "espinal"."cases"        for select using (true);
create policy "public read updates" on "espinal"."case_updates" for select using (true);
-- NOTE: no insert/update policies → anon key is read-only by design.

-- updated_at trigger
create or replace function "espinal"."touch_updated_at"()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists cases_touch on "espinal"."cases";
create trigger cases_touch before update on "espinal"."cases"
  for each row execute function "espinal"."touch_updated_at"();
