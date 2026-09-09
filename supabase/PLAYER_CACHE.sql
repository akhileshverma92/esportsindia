-- Player Find cache: store extracted profiles, not raw Firecrawl pages
create extension if not exists "pgcrypto";

create table if not exists public.players (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  aliases text[] not null default '{}',
  game text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.player_cache (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references public.players(id) on delete cascade,
  profile_json jsonb not null,
  sources jsonb not null default '[]'::jsonb,
  last_updated timestamptz not null default now(),
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  unique (player_id)
);

create index if not exists players_slug_idx on public.players (slug);
create index if not exists players_name_idx on public.players (lower(name));
create index if not exists player_cache_expires_at_idx on public.player_cache (expires_at);

alter table public.players enable row level security;
alter table public.player_cache enable row level security;

-- Public read (site visitors)
drop policy if exists "Public read players" on public.players;
create policy "Public read players"
  on public.players for select
  to anon, authenticated
  using (true);

drop policy if exists "Public read player_cache" on public.player_cache;
create policy "Public read player_cache"
  on public.player_cache for select
  to anon, authenticated
  using (true);

-- Allow anonymous upsert so Player Find can cache without service role
drop policy if exists "Public insert players" on public.players;
create policy "Public insert players"
  on public.players for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Public update players" on public.players;
create policy "Public update players"
  on public.players for update
  to anon, authenticated
  using (true)
  with check (true);

drop policy if exists "Public insert player_cache" on public.player_cache;
create policy "Public insert player_cache"
  on public.player_cache for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Public update player_cache" on public.player_cache;
create policy "Public update player_cache"
  on public.player_cache for update
  to anon, authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated manage players" on public.players;
create policy "Authenticated manage players"
  on public.players for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated manage player_cache" on public.player_cache;
create policy "Authenticated manage player_cache"
  on public.player_cache for all
  to authenticated
  using (true)
  with check (true);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists players_set_updated_at on public.players;
create trigger players_set_updated_at
  before update on public.players
  for each row execute function public.set_updated_at();
