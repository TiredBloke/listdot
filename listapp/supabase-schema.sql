-- ============================================
-- List. — Supabase Database Schema
-- Run this entire file in your Supabase SQL Editor
-- ============================================

-- Profiles table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  is_pro boolean default false,
  stripe_customer_id text,
  stripe_subscription_id text,
  top3 jsonb default '[]'::jsonb,
  top3_open boolean default true,
  created_at timestamptz default now()
);

-- Lists table
create table public.lists (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  color text default '#0f6644',
  created_at timestamptz default now()
);

-- Items table
create table public.items (
  id uuid default gen_random_uuid() primary key,
  list_id uuid references public.lists on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  text text not null,
  done boolean default false,
  starred boolean default false,
  position integer default 0,
  created_at timestamptz default now()
);

-- Auto-create profile when a user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Row Level Security (keeps each user's data private)
alter table public.profiles enable row level security;
alter table public.lists enable row level security;
alter table public.items enable row level security;

create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

create policy "Users can view own lists" on public.lists for select using (auth.uid() = user_id);
create policy "Users can insert own lists" on public.lists for insert with check (auth.uid() = user_id);
create policy "Users can update own lists" on public.lists for update using (auth.uid() = user_id);
create policy "Users can delete own lists" on public.lists for delete using (auth.uid() = user_id);

create policy "Users can view own items" on public.items for select using (auth.uid() = user_id);
create policy "Users can insert own items" on public.items for insert with check (auth.uid() = user_id);
create policy "Users can update own items" on public.items for update using (auth.uid() = user_id);
create policy "Users can delete own items" on public.items for delete using (auth.uid() = user_id);
