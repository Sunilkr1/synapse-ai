-- Synapse AI Hub Master Schema Migration

-- 1. Profiles Table (Extends Supabase Auth)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  avatar_url text,
  accent_color text default '#8B5CF6',
  theme text default 'dark',
  push_token text,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Chats Table
create table if not exists public.chats (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  model text not null,
  preview text,
  is_favorite boolean default false,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. Messages Table
create table if not exists public.messages (
  id uuid default gen_random_uuid() primary key,
  chat_id uuid references public.chats(id) on delete cascade not null,
  role text not null, -- 'user', 'assistant'
  content text not null,
  tokens_used integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 4. Personas & Prompts
create table if not exists public.personas (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  role text,
  system_prompt text not null,
  color text,
  is_public boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 5. Row Level Security (RLS) Policies
alter table public.profiles enable row level security;
alter table public.chats enable row level security;
alter table public.messages enable row level security;
alter table public.personas enable row level security;

-- Profile Policies (Users can only see/edit their own profile)
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "New users can insert profile" on public.profiles for insert with check (auth.uid() = id);

-- Chat Policies
create policy "Users can manage own chats" on public.chats for all using (auth.uid() = user_id);

-- Message Policies (Based on chat ownership)
create policy "Users can manage messages in own chats" on public.messages for all using (
  exists (select 1 from public.chats where id = messages.chat_id and user_id = auth.uid())
);

-- Persona Policies
create policy "Users can manage own personas" on public.personas for all using (auth.uid() = user_id);
create policy "Everyone can view public personas" on public.personas for select using (is_public = true);
