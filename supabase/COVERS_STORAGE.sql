-- Public cover images for articles / player stories
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'covers',
  'covers',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Public read
drop policy if exists "Public read covers" on storage.objects;
create policy "Public read covers"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'covers');

-- Authenticated upload
drop policy if exists "Auth upload covers" on storage.objects;
create policy "Auth upload covers"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'covers');

-- Authenticated update/overwrite
drop policy if exists "Auth update covers" on storage.objects;
create policy "Auth update covers"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'covers')
  with check (bucket_id = 'covers');

-- Authenticated delete
drop policy if exists "Auth delete covers" on storage.objects;
create policy "Auth delete covers"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'covers');
