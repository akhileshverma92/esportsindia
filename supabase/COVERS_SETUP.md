# Create Storage bucket: covers

## Fastest (Dashboard — 30 seconds)

1. Open your project: https://supabase.com/dashboard
2. Go to **Storage**
3. Click **New bucket**
4. Name: `covers`
5. Turn **Public bucket** ON
6. Click **Create bucket**

Then open **SQL Editor** and run only the policies below (bucket already exists):

```sql
drop policy if exists "Public read covers" on storage.objects;
create policy "Public read covers"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'covers');

drop policy if exists "Auth upload covers" on storage.objects;
create policy "Auth upload covers"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'covers');

drop policy if exists "Auth update covers" on storage.objects;
create policy "Auth update covers"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'covers')
  with check (bucket_id = 'covers');

drop policy if exists "Auth delete covers" on storage.objects;
create policy "Auth delete covers"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'covers');
```

## Or run full script

`supabase/COVERS_STORAGE.sql` creates the bucket + policies in one go.

Until the bucket exists, cover upload still works by saving into `public/uploads/` on this machine (local fallback).
