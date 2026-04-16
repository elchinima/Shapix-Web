create extension if not exists pgcrypto;
create extension if not exists citext;

create table if not exists public.shapix_player_accounts (
    id uuid primary key default gen_random_uuid(),
    nickname citext not null unique,
    email citext unique,
    password_hash text not null,
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now()),
    constraint shapix_player_accounts_nickname_len_chk check (char_length(trim(nickname::text)) between 2 and 50),
    constraint shapix_player_accounts_email_len_chk check (email is null or char_length(trim(email::text)) <= 50),
    constraint shapix_player_accounts_email_format_chk check (
        email is null or email::text ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
    )
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at := timezone('utc', now());
    return new;
end;
$$;

drop trigger if exists trg_shapix_player_accounts_set_updated_at on public.shapix_player_accounts;
create trigger trg_shapix_player_accounts_set_updated_at
before update on public.shapix_player_accounts
for each row
execute function public.set_updated_at();

alter table public.shapix_player_accounts enable row level security;

drop policy if exists "service-role-full-access" on public.shapix_player_accounts;
create policy "service-role-full-access"
on public.shapix_player_accounts
for all
to service_role
using (true)
with check (true);

-- register
-- insert into public.shapix_player_accounts (nickname, email, password_hash)
-- values ($1, nullif($2, ''), $3)
-- returning id, nickname, email, created_at, updated_at;

-- get by id
-- select id, nickname, email, created_at, updated_at
-- from public.shapix_player_accounts
-- where id = $1;

-- get by nickname
-- select id, nickname, email, created_at, updated_at
-- from public.shapix_player_accounts
-- where nickname = $1;

-- list users
-- select id, nickname, email, created_at, updated_at
-- from public.shapix_player_accounts
-- order by created_at desc
-- limit $1 offset $2;