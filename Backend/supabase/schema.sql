-- ===========================================================================
-- Tower of Arithmetic: database (matches the ERD)
--
-- Run this whole file once in Supabase: Dashboard > SQL Editor > New query >
-- paste it all > Run. It makes the four tables, the privacy rules and two
-- helper functions the app calls. It's safe to run again later.
--
--   profiles            one per player, made automatically when they sign up
--   character_progress  each character's own level (1-20) and XP
--   topic_progress      running totals per maths topic (for accuracy and
--                       the strengths chart on the Profile screen)
--
--   saved_runs          the run a player is in the middle of (one each)
--
-- Spells, enemies, rooms and topics live in the game's code. Every player
-- can only see and change their own rows.
-- ===========================================================================

-- ---------------------------------------------------------------- profiles
create table if not exists public.profiles (
  id              uuid primary key references auth.users (id) on delete cascade,
  username        text not null check (char_length(username) between 2 and 24),
  grade           smallint check (grade between 1 and 11),
  character_id    text not null default 'shadow',
  xp              integer not null default 0 check (xp >= 0),
  level           integer not null default 1 check (level >= 1),
  highest_floor   integer not null default 0 check (highest_floor >= 0),
  runs_completed  integer not null default 0 check (runs_completed >= 0),
  tutorial_done   boolean not null default false,
  settings        jsonb not null default '{}'::jsonb,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ------------------------------------------------------ character_progress
create table if not exists public.character_progress (
  user_id       uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  character_id  text not null,
  level         smallint not null default 1 check (level between 1 and 20),
  xp            integer not null default 0 check (xp >= 0),
  updated_at    timestamptz not null default now(),
  primary key (user_id, character_id)
);

-- ---------------------------------------------------------- topic_progress
create table if not exists public.topic_progress (
  user_id        uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  topic          text not null,
  version        text not null check (version in ('junior', 'intermediate', 'senior')),
  attempts       integer not null default 0 check (attempts >= 0),
  correct        integer not null default 0 check (correct >= 0),
  time_ms_total  bigint not null default 0 check (time_ms_total >= 0),
  hints_total    integer not null default 0 check (hints_total >= 0),
  updated_at     timestamptz not null default now(),
  primary key (user_id, topic)
);

-- ===================================================================== logic

-- Keep updated_at current
create or replace function public.touch_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists profiles_touch on public.profiles;
create trigger profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();
drop trigger if exists character_progress_touch on public.character_progress;
create trigger character_progress_touch before update on public.character_progress
  for each row execute function public.touch_updated_at();
drop trigger if exists topic_progress_touch on public.topic_progress;
create trigger topic_progress_touch before update on public.topic_progress
  for each row execute function public.touch_updated_at();

-- Make a profile as soon as someone signs up. The app sends the username
-- (and grade, if chosen) in the sign-up's user data.
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, username, grade)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'username'), ''), 'Apprentice'),
    nullif(new.raw_user_meta_data ->> 'grade', '')::smallint
  )
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- XP needed to go from `lvl` to the next level. Must match the app:
--   player:     src/data/playerLevels.js     500 + (level - 1) x 250
--   character:  src/data/characterLevels.js  400 + (level - 1) x 100, max 20
create or replace function public.player_xp_to_next(lvl integer) returns integer
language sql immutable as $$ select 500 + (lvl - 1) * 250 $$;
create or replace function public.character_xp_to_next(lvl integer) returns integer
language sql immutable as $$ select case when lvl >= 20 then 0 else 400 + (lvl - 1) * 100 end $$;

-- After every answered sum: add it to that topic's running totals.
create or replace function public.record_answer(
  p_topic text, p_version text, p_correct boolean, p_time_ms integer default 0, p_hints integer default 0
) returns void
language sql security invoker set search_path = public as $$
  insert into public.topic_progress (user_id, topic, version, attempts, correct, time_ms_total, hints_total)
  values (auth.uid(), p_topic, p_version, 1, case when p_correct then 1 else 0 end,
          greatest(coalesce(p_time_ms, 0), 0), greatest(coalesce(p_hints, 0), 0))
  on conflict (user_id, topic) do update set
    version       = excluded.version,
    attempts      = topic_progress.attempts + 1,
    correct       = topic_progress.correct + excluded.correct,
    time_ms_total = topic_progress.time_ms_total + excluded.time_ms_total,
    hints_total   = topic_progress.hints_total + excluded.hints_total;
$$;

-- When a run ends (won, lost or left): add the XP to the player and the
-- character, level them up, and update the run totals. Returns the new
-- profile so the app can show it straight away.
create or replace function public.finish_run(
  p_floors_cleared integer, p_xp integer, p_character text
) returns public.profiles
language plpgsql security invoker set search_path = public as $$
declare
  p public.profiles;
  c_level smallint;
  c_xp integer;
  gained integer := greatest(coalesce(p_xp, 0), 0);
  new_xp integer;
  new_level integer;
begin
  -- the player
  select xp, level into new_xp, new_level from public.profiles where id = auth.uid();
  if not found then raise exception 'No profile for this player'; end if;
  new_xp := new_xp + gained;
  while new_xp >= public.player_xp_to_next(new_level) loop
    new_xp := new_xp - public.player_xp_to_next(new_level);
    new_level := new_level + 1;
  end loop;
  update public.profiles set
    xp = new_xp,
    level = new_level,
    runs_completed = runs_completed + 1,
    highest_floor = greatest(highest_floor, coalesce(p_floors_cleared, 0))
  where id = auth.uid()
  returning * into p;

  -- the character
  insert into public.character_progress (user_id, character_id) values (auth.uid(), p_character)
  on conflict do nothing;
  select level, xp + gained into c_level, c_xp
  from public.character_progress where user_id = auth.uid() and character_id = p_character;
  while c_level < 20 and c_xp >= public.character_xp_to_next(c_level) loop
    c_xp := c_xp - public.character_xp_to_next(c_level);
    c_level := c_level + 1;
  end loop;
  if c_level >= 20 then c_xp := 0; end if;
  update public.character_progress set level = c_level, xp = c_xp
  where user_id = auth.uid() and character_id = p_character;

  return p;
end $$;

-- ============================================================ privacy rules
alter table public.profiles           enable row level security;
alter table public.character_progress enable row level security;
alter table public.topic_progress     enable row level security;

drop policy if exists "read own profile" on public.profiles;
create policy "read own profile" on public.profiles for select to authenticated
  using (id = auth.uid());
drop policy if exists "update own profile" on public.profiles;
create policy "update own profile" on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists "own characters" on public.character_progress;
create policy "own characters" on public.character_progress for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "own topics" on public.topic_progress;
create policy "own topics" on public.topic_progress for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Only signed-in players may call the helper functions
revoke execute on function public.record_answer(text, text, boolean, integer, integer) from public, anon;
revoke execute on function public.finish_run(integer, integer, text) from public, anon;
grant execute on function public.record_answer(text, text, boolean, integer, integer) to authenticated;
grant execute on function public.finish_run(integer, integer, text) to authenticated;

-- ------------------------------------------------------------- saved_runs
-- The run a player is in the middle of (one per player). The app saves it
-- after every change and deletes it when the run ends, so the run carries
-- on after the app closes, on the phone or the website.
create table if not exists public.saved_runs (
  user_id     uuid primary key default auth.uid() references public.profiles (id) on delete cascade,
  run         jsonb not null,
  updated_at  timestamptz not null default now()
);

drop trigger if exists saved_runs_touch on public.saved_runs;
create trigger saved_runs_touch before update on public.saved_runs
  for each row execute function public.touch_updated_at();

alter table public.saved_runs enable row level security;
drop policy if exists "own saved run" on public.saved_runs;
create policy "own saved run" on public.saved_runs for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- -------------------------------------------------------- delete_my_account
-- The Account screen's "Delete account": removes the player's login. Their
-- profile, characters, topic totals and saved run go with it (on delete
-- cascade). A player can only ever delete their own account.
create or replace function public.delete_my_account() returns void
language plpgsql security definer set search_path = public, auth as $$
begin
  if auth.uid() is null then raise exception 'Not logged in'; end if;
  delete from auth.users where id = auth.uid();
end $$;

revoke execute on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
