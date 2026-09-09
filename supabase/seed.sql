# Optional seed after tables exist — run in SQL Editor
insert into public.articles (
  title, slug, excerpt, content, image, game, category, author, status, tags, reading_time, published_at
) values
(
  'Nebula Esports Crowned BGMS Season 5 Champions After Dominant Grand Finals',
  'bgms-season-5-final',
  'Nebula Esports delivered a commanding performance in the grand finals to claim the championship and take home the top prize.',
  E'The final circle had barely settled when Nebula Esports knew they had done enough. Across three days of relentless competition, the roster played with a rare combination of patience and precision.\n\nThe championship was shaped by small decisions: a patient rotate through the eastern ridge, a late smoke wall in the fifth match and a final push that turned a narrow deficit into a decisive win.\n\nFor the squad, this result is more than a trophy. It is proof that a disciplined identity can survive the pressure of a packed LAN final and a leaderboard that never stopped moving.',
  '/images/hero-esports.png',
  'BGMI',
  'Tournaments',
  'Indian eSports Express Editorial',
  'published',
  array['BGMS','Results','Nebula Esports'],
  '6 min read',
  now()
)
on conflict (slug) do nothing;
