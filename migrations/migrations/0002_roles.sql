-- Role assignments for signed-in users. One row per user who has been given
-- elevated access — anyone NOT in this table is treated as a plain "viewer"
-- (can see everything, can't edit anything).
--
-- Roles:
--   'coach'    — full edit access (players, coaches, matches, trainings, etc.)
--   'designer' — can only edit card design/style (design presets, cardStyle
--                on players/coaches) — not roster data, results, or call-ups
--   'viewer'   — read-only (this is also the default for anyone not listed here)
--
-- Rows are added manually by you (the site owner) for now — there is no
-- self-serve "become a coach" flow. See scripts note below for how to grant one.

create table if not exists app_users (
  user_id text primary key references "user" ("id") on delete cascade,
  role text not null default 'viewer' check (role in ('coach', 'designer', 'viewer')),
  created_at timestamptz not null default current_timestamp
);

create index if not exists app_users_role_idx on app_users (role);