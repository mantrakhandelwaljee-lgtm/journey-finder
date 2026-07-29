-- Add transport_number column to journeys table
ALTER TABLE journeys ADD COLUMN IF NOT EXISTS transport_number text;

-- Add transport_type and transport_number columns to journey_stops table
ALTER TABLE journey_stops ADD COLUMN IF NOT EXISTS transport_type text;
ALTER TABLE journey_stops ADD COLUMN IF NOT EXISTS transport_number text;

-- Add index for transport_number searches
CREATE INDEX IF NOT EXISTS journeys_transport_number_idx ON journeys(transport_number);
CREATE INDEX IF NOT EXISTS journey_stops_transport_number_idx ON journey_stops(transport_number);
