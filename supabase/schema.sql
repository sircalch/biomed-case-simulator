create table if not exists public.simulation_runs (
  id bigserial primary key,
  external_id text not null unique,
  case_id text not null,
  case_title text not null,
  equipment text not null,
  trainee_alias text not null default 'Invitado',
  score integer not null,
  max_score integer not null,
  correct_count integer not null,
  total_questions integer not null,
  verdict text not null check (verdict in ('Excelente', 'Solido', 'En desarrollo')),
  completed_at timestamptz not null default now()
);
