-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role TEXT NOT NULL CHECK (role IN ('citizen', 'staff', 'supervisor', 'admin')),
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Staff profiles table
CREATE TABLE staff_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    department TEXT,
    ward TEXT,
    reports_to UUID REFERENCES users(id)
);

-- Tickets table
CREATE TABLE tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_by UUID NOT NULL REFERENCES users(id),
    category TEXT NOT NULL CHECK (category IN ('garbage', 'electricity', 'water', 'other')),
    title TEXT,
    description TEXT NOT NULL,
    address_text TEXT,
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'assigned', 'in_progress', 'waiting_supervisor', 'resolved', 'closed', 'reopened')),
    assigned_to UUID REFERENCES users(id),
    current_supervisor UUID REFERENCES users(id),
    citizen_rating INTEGER CHECK (citizen_rating >= 1 AND citizen_rating <= 5),
    citizen_feedback TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    closed_at TIMESTAMPTZ
);

-- Ticket events table  
CREATE TABLE ticket_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    actor_id UUID NOT NULL REFERENCES users(id),
    type TEXT NOT NULL CHECK (type IN ('created', 'assigned', 'status_changed', 'comment', 'escalated', 'resolved', 'closed', 'reopened')),
    from_status TEXT,
    to_status TEXT,
    message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ticket attachments table
CREATE TABLE ticket_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    uploaded_by UUID NOT NULL REFERENCES users(id),
    kind TEXT NOT NULL CHECK (kind IN ('photo', 'document')),
    url TEXT NOT NULL,
    mime_type TEXT,
    caption TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_tickets_created_by ON tickets(created_by);
CREATE INDEX idx_tickets_assigned_to ON tickets(assigned_to);
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_category ON tickets(category);
CREATE INDEX idx_tickets_current_supervisor ON tickets(current_supervisor);
CREATE INDEX idx_ticket_events_ticket_id_created_at ON ticket_events(ticket_id, created_at);
CREATE INDEX idx_ticket_attachments_ticket_id ON ticket_attachments(ticket_id);

-- Updated at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger to tickets table
CREATE TRIGGER update_tickets_updated_at 
    BEFORE UPDATE ON tickets 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();