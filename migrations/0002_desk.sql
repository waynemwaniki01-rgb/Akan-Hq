-- Per-user desk storage: one row per signed-in user, holding the full
-- DeskData slice (players, coaches, trainings, matches, trophies, callUps,
-- designPresets, opponentIntel) as JSON. Full-replace reads/writes only —
-- see src/routes/api/desk.ts.
create table if not exists desk_data (
  user_id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);