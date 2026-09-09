-- Allow Player Story as a game value (keeps Esports for older rows)
alter table public.articles drop constraint if exists articles_game_check;
alter table public.articles
  add constraint articles_game_check
  check (game in ('BGMI', 'Free Fire', 'Esports', 'Player Story'));

-- Optional: rename existing Esports rows to Player Story
update public.articles
set game = 'Player Story'
where game = 'Esports';
