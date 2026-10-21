-- ===========================================================================
-- Update (October 2026): saved runs and deleting an account.
--
-- If you already ran schema.sql before, run ONLY this file: Supabase >
-- SQL Editor > New query > paste it all > Run. It's safe to run again.
-- (schema.sql has the same lines at the bottom for new projects.)
-- ===========================================================================

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
