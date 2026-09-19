create table if not exists app_users (
  user_id text primary key references "user" ("id") on delete cascade,
  role text not null default 'viewer' check (role in ('coach', 'designer', 'viewer')),
  created_at timestamptz not null default current_timestamp
);

create index if not exists app_users_role_idx on app_users (role);
