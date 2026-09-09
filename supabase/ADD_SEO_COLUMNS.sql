-- Run once in Supabase → SQL Editor
-- Fixes: Could not find the 'seo_description' column of 'articles' in the schema cache

alter table public.articles add column if not exists seo_title text;
alter table public.articles add column if not exists seo_description text;
alter table public.articles add column if not exists seo_keywords text[] default '{}'::text[];

alter table public.articles add column if not exists is_featured boolean not null default false;
alter table public.articles add column if not exists is_trending boolean not null default false;

create index if not exists articles_is_featured_idx on public.articles (is_featured) where is_featured = true;
create index if not exists articles_is_trending_idx on public.articles (is_trending) where is_trending = true;

-- Refresh PostgREST schema cache
notify pgrst, 'reload schema';
