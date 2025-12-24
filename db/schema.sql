
-- Habilitar extensiones comunes (si no existen)
-- create extension if not exists pgcrypto;
-- create extension if not exists uuid-ossp;

-- Tabla de publicaciones
create table if not exists public.posts (
  id bigserial primary key,
  user_id uuid not null,
  author text,
  photo_url text,
  text text,
  image_url text,
  created_at timestamptz default now()
);

-- Tabla de perfiles
create table if not exists public.profiles (
  user_id uuid primary key,
  song_url text,
  bio text,
  updated_at timestamptz default now()
);

-- Tabla de chat
create table if not exists public.chat_messages (
  id bigserial primary key,
  user_id uuid not null,
  author text,
  text text not null,
  created_at timestamptz default now()
);

-- Activar RLS
alter table public.posts enable row level security;
alter table public.profiles enable row level security;
alter table public.chat_messages enable row level security;

-- Policies básicas
-- Lectura pública
create policy if not exists posts_select on public.posts for select using ( true );
create policy if not exists profiles_select on public.profiles for select using ( true );
create policy if not exists chat_select on public.chat_messages for select using ( true );

-- Escritura autenticada
create policy if not exists posts_insert on public.posts for insert with check ( auth.uid() = user_id );
create policy if not exists profiles_upsert on public.profiles for insert with check ( auth.uid() = user_id );
create policy if not exists profiles_update on public.profiles for update using ( auth.uid() = user_id );
create policy if not exists chat_insert on public.chat_messages for insert with check ( auth.uid() = user_id );
