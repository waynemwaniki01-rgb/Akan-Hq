-- App schema: players, coaches, trainings, matches, trophies, call-ups,
-- design presets. Matches the types in src/lib/pitch/types.ts.
--
-- Complex nested shapes (cardStyle, currentSix/baseSix, detail, history,
-- call-up entries, etc.) are stored as jsonb so this schema stays close to
-- the app's TypeScript types instead of exploding into dozens of columns.
--
-- `coaches.user_id` and `players.guardian_user_id` are nullable FK-style
-- links (TEXT, referencing "user"("id") from 0001_auth.sql) — populated once
-- a coach or guardian signs in and gets linked to their record. Until then
-- these stay null and the app works exactly as it does today.

create table if not exists players (
  id text primary key,
  name text not null,
  photo text,
  position text not null,
  secondary_positions jsonb not null default '[]',
  foot text not null,
  number text not null,
  age integer not null,
  height integer not null,
  captain boolean not null default false,
  team text not null,
  email text not null default '',
  phone text not null default '',
  guardian_name text not null default '',
  guardian_email text not null default '',
  guardian_phone text not null default '',
  category text not null,
  card_design text not null default 'auto',
  card_style jsonb,
  base_six jsonb not null,
  current_six jsonb not null,
  detail jsonb not null,
  gk_base jsonb,
  gk_current jsonb,
  play_styles jsonb not null default '[]',
  play_styles_plus jsonb not null default '[]',
  weak_foot smallint not null default 3,
  skill_moves smallint not null default 3,
  history jsonb not null default '[]',
  created_at timestamptz not null default current_timestamp,
  -- Linked once this player's guardian signs in. Null = not yet linked.
  guardian_user_id text references "user" ("id") on delete set null
);

create table if not exists coaches (
  id text primary key,
  name text not null,
  photo text,
  role text not null,
  phone text not null default '',
  email text not null default '',
  team text not null,
  category text not null,
  bio text not null default '',
  card_design text not null default 'auto',
  card_style jsonb,
  created_at timestamptz not null default current_timestamp,
  -- Linked once this coach signs in. Null = not yet linked.
  user_id text references "user" ("id") on delete set null
);

create table if not exists trainings (
  id text primary key,
  date text not null,
  title text not null,
  category text not null,
  attendance jsonb not null default '{}'
);

create table if not exists matches (
  id text primary key,
  date text not null,
  opponent text not null,
  venue text not null,
  kickoff text not null,
  kind text not null,
  category text not null,
  lineup jsonb not null default '[]',
  slot_map jsonb not null default '{}',
  ratings jsonb not null default '{}',
  goals jsonb not null default '{}',
  team_score integer,
  opponent_score integer,
  motm text
);

create table if not exists trophies (
  id text primary key,
  name text not null,
  competition text not null,
  season text not null,
  notes text not null default '',
  photo text,
  created_at timestamptz not null default current_timestamp
);

create table if not exists call_ups (
  id text primary key,
  name text not null,
  coach_id text not null,
  category text not null,
  date text not null,
  entries jsonb not null default '[]',
  created_at timestamptz not null default current_timestamp
);

create table if not exists design_presets (
  id text primary key,
  name text not null,
  card_design text not null,
  style jsonb not null
);

-- Single-row-per-category opponent intel (strengths/weaknesses notes).
create table if not exists opponent_intel (
  category text primary key,
  strengths text not null default '',
  weaknesses text not null default ''
);

create index if not exists players_category_idx on players (category);
create index if not exists players_guardian_user_id_idx on players (guardian_user_id);
create index if not exists coaches_category_idx on coaches (category);
create index if not exists coaches_user_id_idx on coaches (user_id);
create index if not exists trainings_category_idx on trainings (category);
create index if not exists matches_category_idx on matches (category);
create index if not exists call_ups_category_idx on call_ups (category);