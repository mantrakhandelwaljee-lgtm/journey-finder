-- Create users table
create table users (
  id uuid primary key,
  email text unique,
  name text not null,
  phone text,
  college text,
  college_year text,
  branch text,
  avatar_url text,
  auth_provider text not null,
  is_onboarded boolean default false not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Create journeys table
create table journeys (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) not null,
  origin_name text not null,
  origin_lat float8 not null,
  origin_lng float8 not null,
  destination_name text not null,
  destination_lat float8 not null,
  destination_lng float8 not null,
  departure_time timestamptz not null,
  arrival_time timestamptz not null,
  transport_type text not null,
  seats_available int4 not null default 1,
  notes text,
  status text not null default 'active',
  created_at timestamptz default now() not null
);

-- Create journey_stops table
create table journey_stops (
  id uuid primary key default gen_random_uuid(),
  journey_id uuid references journeys(id) on delete cascade not null,
  stop_order int4 not null,
  stop_name text not null,
  stop_lat float8 not null,
  stop_lng float8 not null,
  estimated_arrival timestamptz not null,
  estimated_departure timestamptz not null
);

-- Create join_requests table
create table join_requests (
  id uuid primary key default gen_random_uuid(),
  journey_id uuid references journeys(id) on delete cascade not null,
  requester_id uuid references users(id) not null,
  status text not null default 'pending',
  message text,
  created_at timestamptz default now() not null
);

-- Add indexes for common query patterns
create index journeys_destination_idx on journeys(destination_lat, destination_lng);
create index journeys_status_departure_idx on journeys(status, departure_time);
create index journey_stops_journey_order_idx on journey_stops(journey_id, stop_order);
create index journey_stops_location_idx on journey_stops(stop_lat, stop_lng);
create index join_requests_journey_idx on join_requests(journey_id);
create index join_requests_requester_idx on join_requests(requester_id);
