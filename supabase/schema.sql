-- KCP Forum — Supabase schema
-- Run this file in the Supabase Dashboard -> SQL Editor (top to bottom).

-- ============================================================
-- PROFILES
-- ============================================================
create table public.profiles (
  id           uuid primary key,
  email        text,
  display_name text not null,
  avatar_url   text,
  role         text not null default 'user' check (role in ('user', 'admin')),
  created_at   timestamptz not null default now()
);

-- No FK to auth.users so seed data can insert fictional authors.

-- Auto-create a profile whenever a new auth user registers.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data->>'display_name',
      split_part(coalesce(new.email, 'user'), '@', 1)
    )
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- POSTS
-- ============================================================
create table public.posts (
  id            uuid primary key default gen_random_uuid(),
  author_id     uuid not null references public.profiles(id) on delete cascade,
  title         text not null check (char_length(title) between 1 and 200),
  description   text not null check (char_length(description) between 1 and 20000),
  category      text not null,
  tags          text[] not null default '{}',
  media_type    text not null default 'none' check (media_type in ('image', 'video', 'none')),
  media_url     text,
  media_alt     text,
  media_caption text,
  views         integer not null default 0,
  comments      integer not null default 0,
  featured      boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index posts_category_idx on public.posts (category);
create index posts_created_idx on public.posts (created_at desc);
create index posts_tags_idx on public.posts using gin (tags);

-- ============================================================
-- COMMENTS
-- ============================================================
create table public.comments (
  id         uuid primary key default gen_random_uuid(),
  post_id    uuid not null references public.posts(id) on delete cascade,
  author_id  uuid not null references public.profiles(id) on delete cascade,
  content    text not null check (char_length(content) between 1 and 2000),
  created_at timestamptz not null default now()
);

create index comments_post_idx on public.comments (post_id, created_at);

-- Keep posts.comments counter in sync.
create or replace function public.bump_comment_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    update public.posts set comments = comments + 1 where id = new.post_id;
  elsif tg_op = 'DELETE' then
    update public.posts set comments = greatest(comments - 1, 0) where id = old.post_id;
  end if;
  return null;
end;
$$;

create trigger comments_count_ai
  after insert or delete on public.comments
  for each row execute function public.bump_comment_count();

-- ============================================================
-- HELPERS
-- ============================================================
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- Anon-safe view counter (RLS blocks direct posts UPDATE for visitors).
create or replace function public.increment_view(p_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.posts set views = views + 1 where id = p_id;
$$;

grant execute on function public.increment_view(uuid) to anon, authenticated;
grant execute on function public.is_admin() to anon, authenticated;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.comments enable row level security;

-- profiles: publicly readable, users edit their own row.
create policy "profiles_select_all" on public.profiles
  for select using (true);

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- Only admins (or the SQL editor / service role) can change roles.
create or replace function public.prevent_role_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role
     and not public.is_admin()
     and auth.uid() is not null then
    raise exception 'Only admins can change roles';
  end if;
  return new;
end;
$$;

create trigger profiles_role_guard
  before update on public.profiles
  for each row execute function public.prevent_role_escalation();

-- posts: public read, admin write.
create policy "posts_select_all" on public.posts
  for select using (true);

create policy "posts_insert_admin" on public.posts
  for insert with check (public.is_admin());

create policy "posts_update_admin" on public.posts
  for update using (public.is_admin()) with check (public.is_admin());

create policy "posts_delete_admin" on public.posts
  for delete using (public.is_admin());

-- comments: public read, authenticated users insert their own, own-or-admin delete.
create policy "comments_select_all" on public.comments
  for select using (true);

create policy "comments_insert_own" on public.comments
  for insert with check (auth.uid() is not null and author_id = auth.uid());

create policy "comments_delete_own_or_admin" on public.comments
  for delete using (public.is_admin() or author_id = auth.uid());

-- ============================================================
-- STORAGE (post-media bucket)
-- ============================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'post-media',
  'post-media',
  true,
  52428800, -- 50 MB
  array['image/*', 'video/mp4', 'video/webm']
)
on conflict (id) do nothing;

create policy "post_media_public_read" on storage.objects
  for select using (bucket_id = 'post-media');

create policy "post_media_admin_insert" on storage.objects
  for insert with check (bucket_id = 'post-media' and public.is_admin());

create policy "post_media_admin_delete" on storage.objects
  for delete using (bucket_id = 'post-media' and public.is_admin());
