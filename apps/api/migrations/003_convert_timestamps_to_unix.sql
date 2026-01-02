-- Convert timestamp columns to BIGINT (Unix epoch in milliseconds) for Zero compatibility

-- Users table
ALTER TABLE users 
  ALTER COLUMN created_at DROP DEFAULT;
ALTER TABLE users
  ALTER COLUMN created_at TYPE BIGINT USING (EXTRACT(EPOCH FROM created_at) * 1000)::BIGINT;
ALTER TABLE users
  ALTER COLUMN created_at SET DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT;

-- Tickets table  
ALTER TABLE tickets
  ALTER COLUMN created_at DROP DEFAULT,
  ALTER COLUMN updated_at DROP DEFAULT,
  ALTER COLUMN closed_at DROP DEFAULT;
ALTER TABLE tickets
  ALTER COLUMN created_at TYPE BIGINT USING (EXTRACT(EPOCH FROM created_at) * 1000)::BIGINT,
  ALTER COLUMN updated_at TYPE BIGINT USING (EXTRACT(EPOCH FROM updated_at) * 1000)::BIGINT,
  ALTER COLUMN closed_at TYPE BIGINT USING (EXTRACT(EPOCH FROM closed_at) * 1000)::BIGINT;
ALTER TABLE tickets
  ALTER COLUMN created_at SET DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT,
  ALTER COLUMN updated_at SET DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT;

-- Ticket events table
ALTER TABLE ticket_events
  ALTER COLUMN created_at DROP DEFAULT;
ALTER TABLE ticket_events
  ALTER COLUMN created_at TYPE BIGINT USING (EXTRACT(EPOCH FROM created_at) * 1000)::BIGINT;
ALTER TABLE ticket_events
  ALTER COLUMN created_at SET DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT;

-- Ticket attachments table
ALTER TABLE ticket_attachments
  ALTER COLUMN created_at DROP DEFAULT;
ALTER TABLE ticket_attachments
  ALTER COLUMN created_at TYPE BIGINT USING (EXTRACT(EPOCH FROM created_at) * 1000)::BIGINT;
ALTER TABLE ticket_attachments
  ALTER COLUMN created_at SET DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT;

-- Add a trigger to auto-update updated_at on tickets
DROP TRIGGER IF EXISTS update_tickets_updated_at ON tickets;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT;
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tickets_updated_at 
BEFORE UPDATE ON tickets
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
