-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Drop existing tables if they exist
drop table if exists groups;
drop table if exists users;

-- Create users table
create table users (
  id uuid primary key default uuid_generate_v4(),
  telegram_id text unique not null,
  role text default 'user',
  created_at timestamp default now()
);

-- Create groups table
create table groups (
  id uuid primary key default uuid_generate_v4(),
  group_id text not null unique,
  group_name text,
  admin_id text not null,  -- Telegram user ID as text
  message text,
  interval_minutes int default 60,
  last_sent_at timestamp,
  is_active boolean default true,  -- New column for stop/resume functionality
  created_at timestamp default now()
);

-- Enable RLS first
alter table users enable row level security;
alter table groups enable row level security;

-- Create indexes for better performance
create index idx_groups_group_id on groups(group_id);
create index idx_groups_admin_id on groups(admin_id);
create index idx_users_telegram_id on users(telegram_id);

-- Drop existing policies if they exist
drop policy if exists "Admin can read own groups" on groups;
drop policy if exists "Admin can update own groups" on groups;
drop policy if exists "Authenticated users can create groups" on groups;
drop policy if exists "Admin can delete own groups" on groups;
drop policy if exists "Service role has full access to groups" on groups;
drop policy if exists "Users can read own data" on users;
drop policy if exists "Service role can create users" on users;
drop policy if exists "Users can update own data" on users;
drop policy if exists "Service role can delete users" on users;
drop policy if exists "Service role has full access to users" on users;

-- Groups table policies
create policy "Service role has full access to groups"
on groups for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

create policy "Admin can read own groups"
on groups for select
using (admin_id = auth.uid()::text);

create policy "Admin can update own groups"
on groups for update
using (admin_id = auth.uid()::text);

create policy "Admin can delete own groups"
on groups for delete
using (admin_id = auth.uid()::text);

-- Users table policies
create policy "Service role has full access to users"
on users for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

create policy "Users can read own data"
on users for select
using (telegram_id = auth.uid()::text);

create policy "Users can update own data"
on users for update
using (telegram_id = auth.uid()::text); 