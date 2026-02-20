create table if not exists public.missions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  date timestamptz not null,
  location text not null,
  category text not null check (category in ('cleanup','planting','workshop')),
  capacity int not null
);

create table if not exists public.participations (
  id uuid primary key default gen_random_uuid(),
  mission_id uuid not null references public.missions(id) on delete cascade,
  user_id uuid not null,
  status text not null check (status in ('confirmed','cancelled')),
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key,
  email text not null unique,
  display_name text not null,
  actions_count int not null default 0
);

alter table public.missions enable row level security;
alter table public.participations enable row level security;
alter table public.profiles enable row level security;

create policy missions_read for public.missions
  as permissive
  for select
  to anon, authenticated
  using (true);

create policy participations_user_rw for public.participations
  as permissive
  for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy profiles_user_r for public.profiles
  as permissive
  for select
  to authenticated
  using (auth.uid() = id);

insert into public.missions (title, description, date, location, category, capacity) values
('Nettoyage parc', 'Ramassage des déchets au parc central', now() + interval '2 days', 'Paris', 'cleanup', 20),
('Plantation arbres', 'Plantation de jeunes arbres dans le quartier', now() + interval '5 days', 'Lyon', 'planting', 15),
('Atelier recyclage', 'Sensibilisation au tri des déchets', now() + interval '7 days', 'Marseille', 'workshop', 30);
