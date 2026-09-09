-- Indian eSports Express CMS: articles + AI rewrite queue
create extension if not exists "pgcrypto";

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text not null default '',
  image text,
  game text not null default 'Esports' check (game in ('BGMI', 'Free Fire', 'Esports')),
  category text not null default 'News',
  author text not null default 'Indian eSports Express Editorial',
  status text not null default 'draft' check (status in ('draft', 'pending', 'published', 'rejected')),
  source_name text,
  source_url text,
  tags text[] not null default '{}',
  reading_time text,
  views integer not null default 0,
  created_by uuid references auth.users(id) on delete set null,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ai_jobs (
  id uuid primary key default gen_random_uuid(),
  source_url text not null,
  source_name text,
  raw_content text,
  rewritten_title text,
  rewritten_excerpt text,
  rewritten_content text,
  game text,
  category text,
  tags text[] default '{}',
  model text check (model in ('gemini', 'openai')),
  status text not null default 'pending' check (status in ('pending', 'processing', 'approved', 'rejected', 'failed')),
  confidence numeric,
  risk text,
  error text,
  article_id uuid references public.articles(id) on delete set null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists articles_status_published_at_idx on public.articles (status, published_at desc);
create index if not exists articles_game_idx on public.articles (game);
create index if not exists articles_slug_idx on public.articles (slug);
create index if not exists ai_jobs_status_idx on public.ai_jobs (status, created_at desc);

alter table public.articles enable row level security;
alter table public.ai_jobs enable row level security;

drop policy if exists "Public can read published articles" on public.articles;
create policy "Public can read published articles"
  on public.articles for select
  to anon, authenticated
  using (status = 'published');

drop policy if exists "Authenticated manage articles" on public.articles;
create policy "Authenticated manage articles"
  on public.articles for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated manage ai_jobs" on public.ai_jobs;
create policy "Authenticated manage ai_jobs"
  on public.ai_jobs for all
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

drop trigger if exists articles_set_updated_at on public.articles;
create trigger articles_set_updated_at
  before update on public.articles
  for each row execute function public.set_updated_at();

drop trigger if exists ai_jobs_set_updated_at on public.ai_jobs;
create trigger ai_jobs_set_updated_at
  before update on public.ai_jobs
  for each row execute function public.set_updated_at();
