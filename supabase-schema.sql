-- ============================================================
-- Yield Pilot — Supabase Schema
-- Run this in your Supabase project → SQL Editor
-- ============================================================

-- Saved calculations table
create table if not exists public.saved_calculations (
  id           uuid default gen_random_uuid() primary key,
  user_id      uuid references auth.users(id) on delete cascade not null,
  type         text not null,  -- 'hysa' | 'credit' | 'debt' | 'loan' | 'networth' | etc.
  name         text not null default 'Untitled',
  summary      text,
  result_value text,
  inputs       jsonb,          -- full input snapshot so user can restore it
  created_at   timestamptz default now() not null,
  updated_at   timestamptz default now() not null
);

-- Index for fast user lookups
create index if not exists saved_calculations_user_id_idx
  on public.saved_calculations(user_id);

-- Row Level Security — users can only see/edit their own calculations
alter table public.saved_calculations enable row level security;

create policy "Users can view their own calculations"
  on public.saved_calculations for select
  using (auth.uid() = user_id);

create policy "Users can insert their own calculations"
  on public.saved_calculations for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own calculations"
  on public.saved_calculations for update
  using (auth.uid() = user_id);

create policy "Users can delete their own calculations"
  on public.saved_calculations for delete
  using (auth.uid() = user_id);

-- Auto-update updated_at on row change
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger handle_updated_at
  before update on public.saved_calculations
  for each row execute procedure public.handle_updated_at();

-- Profiles table (extends auth.users with display name etc.)
create table if not exists public.profiles (
  id           uuid references auth.users(id) on delete cascade primary key,
  full_name    text,
  updated_at   timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Auto-create profile when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
