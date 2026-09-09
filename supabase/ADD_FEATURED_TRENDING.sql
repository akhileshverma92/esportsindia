-- Featured + Trending placement flags for public homepage
alter table public.articles add column if not exists is_featured boolean not null default false;
alter table public.articles add column if not exists is_trending boolean not null default false;

create index if not exists articles_is_featured_idx on public.articles (is_featured) where is_featured = true;
create index if not exists articles_is_trending_idx on public.articles (is_trending) where is_trending = true;
