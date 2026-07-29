-- Create otps table
create table otps (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  otp text not null,
  expires_at timestamptz not null,
  created_at timestamptz default now() not null
);

-- Index for fast lookup by email
create index otps_email_idx on otps(email);
