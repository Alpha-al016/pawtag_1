-- PawTag Secret Token Access
-- Run this migration in Supabase SQL Editor.

create table public.pets
  add column if not exists tag_id text,
  add column if not exists secret_token uuid,
  add column if not exists is_claimed boolean not null default false,
  add column if not exists owner_email text;

create unique index if not exists pets_tag_id_unique
  on public.pets(tag_id)
  where tag_id is not null;

create unique index if not exists pets_secret_token_unique
  on public.pets(secret_token)
  where secret_token is not null;

create index if not exists pets_owner_email_idx
  on public.pets(owner_email);

create index if not exists pets_secret_token_idx
  on public.pets(secret_token);

alter table public.pets enable row level security;

-- No anon policies are intentionally created here.
-- Public/edit/claim access goes through Edge Functions.
