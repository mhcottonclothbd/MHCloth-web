-- Enable RLS and add safe policies for public.profiles and public.admin_users
-- Idempotent: checks for table existence and existing policies

-- Helper: is_admin() based on JWT email
create schema if not exists public;
create or replace function public.is_admin() returns boolean
language sql stable as $$
  select coalesce(auth.jwt() ->> 'email', '') = 'mhcottonclothbd@gmail.com'
$$;

-- Enable RLS and policies for profiles
do $$
declare
  has_profiles boolean := to_regclass('public.profiles') is not null;
  has_view boolean := exists (select 1 from pg_policies where schemaname='public' and tablename='profiles' and policyname='Profiles can view own row');
  has_insert boolean := exists (select 1 from pg_policies where schemaname='public' and tablename='profiles' and policyname='Profiles can insert own row');
  has_update boolean := exists (select 1 from pg_policies where schemaname='public' and tablename='profiles' and policyname='Profiles can update own row');
begin
  if has_profiles then
    execute 'alter table public.profiles enable row level security';
    if not has_view then
      execute 'create policy "Profiles can view own row" on public.profiles for select using (auth.uid() = id)';
    end if;
    if not has_insert then
      execute 'create policy "Profiles can insert own row" on public.profiles for insert with check (auth.uid() = id)';
    end if;
    if not has_update then
      execute 'create policy "Profiles can update own row" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id)';
    end if;
  end if;
end$$;

-- Enable RLS and admin-only policies for admin_users
do $$
declare
  has_admin_users boolean := to_regclass('public.admin_users') is not null;
  has_admin_policy boolean := exists (select 1 from pg_policies where schemaname='public' and tablename='admin_users' and policyname='Admins can manage admin_users');
begin
  if has_admin_users then
    execute 'alter table public.admin_users enable row level security';
    if not has_admin_policy then
      execute 'create policy "Admins can manage admin_users" on public.admin_users for all using (public.is_admin()) with check (public.is_admin())';
    end if;
  end if;
end$$;


