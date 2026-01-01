-- Seed users (all passwords are 'password123' for demo)
INSERT INTO users (id, role, name, email, password_hash) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'admin', 'System Admin', 'admin@city.gov', '$2b$10$8K4vV5JZxW6X1E9rO0v3A.5C6Yp1.XqQ8KZN2FwG7UxV3ZF2vM8Ge'), -- password: password123
('550e8400-e29b-41d4-a716-446655440001', 'supervisor', 'John Supervisor', 'supervisor@city.gov', '$2b$10$8K4vV5JZxW6X1E9rO0v3A.5C6Yp1.XqQ8KZN2FwG7UxV3ZF2vM8Ge'), -- password: password123
('550e8400-e29b-41d4-a716-446655440002', 'staff', 'Jane Staff', 'staff@city.gov', '$2b$10$8K4vV5JZxW6X1E9rO0v3A.5C6Yp1.XqQ8KZN2FwG7UxV3ZF2vM8Ge'), -- password: password123
('550e8400-e29b-41d4-a716-446655440003', 'citizen', 'Raj Kumar', 'raj@example.com', '$2b$10$8K4vV5JZxW6X1E9rO0v3A.5C6Yp1.XqQ8KZN2FwG7UxV3ZF2vM8Ge'), -- password: password123
('550e8400-e29b-41d4-a716-446655440004', 'citizen', 'Priya Singh', 'priya@example.com', '$2b$10$8K4vV5JZxW6X1E9rO0v3A.5C6Yp1.XqQ8KZN2FwG7UxV3ZF2vM8Ge'); -- password: password123

-- Seed staff profiles  
INSERT INTO staff_profiles (user_id, department, ward, reports_to) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'municipal', 'ward-1', NULL),
('550e8400-e29b-41d4-a716-446655440002', 'garbage', 'ward-1', '550e8400-e29b-41d4-a716-446655440001');

-- Seed some sample tickets
INSERT INTO tickets (id, created_by, category, title, description, address_text, status) VALUES
('660e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440003', 'garbage', 'Overflowing garbage bin', 'The garbage bin on MG Road is overflowing and causing hygiene issues', '123 MG Road, Chennai', 'new'),
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440004', 'electricity', 'Street light not working', 'Street light near bus stop has been out for 3 days', 'Bus Stop, Anna Nagar', 'assigned');

-- Update one ticket to be assigned
UPDATE tickets SET assigned_to = '550e8400-e29b-41d4-a716-446655440002' WHERE id = '660e8400-e29b-41d4-a716-446655440001';

-- Add initial ticket events
INSERT INTO ticket_events (ticket_id, actor_id, type, to_status) VALUES
('660e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440003', 'created', 'new'),
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440004', 'created', 'new'),
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'assigned', 'assigned');