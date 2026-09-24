-- La Arena: personajes y listas. Ejecuta esto en Supabase → SQL Editor.

create table if not exists public.characters (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name       text not null check (char_length(name) between 1 and 40),
  gender     text not null check (gender in ('chico', 'chica')),
  hair       text not null,
  eyes       text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.lists (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name       text not null check (char_length(name) between 1 and 40),
  created_at timestamptz not null default now()
);

create table if not exists public.list_members (
  list_id      uuid not null references public.lists(id) on delete cascade,
  character_id uuid not null references public.characters(id) on delete cascade,
  user_id      uuid not null default auth.uid() references auth.users(id) on delete cascade,
  primary key (list_id, character_id)
);

create index if not exists characters_user_idx on public.characters(user_id);
create index if not exists lists_user_idx on public.lists(user_id);
create index if not exists list_members_user_idx on public.list_members(user_id);

alter table public.characters   enable row level security;
alter table public.lists        enable row level security;
alter table public.list_members enable row level security;

drop policy if exists "own characters" on public.characters;
create policy "own characters" on public.characters
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

drop policy if exists "own lists" on public.lists;
create policy "own lists" on public.lists
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

drop policy if exists "own list members" on public.list_members;
create policy "own list members" on public.list_members
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));
