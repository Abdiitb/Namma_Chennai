export type UserRole = 'citizen' | 'staff' | 'supervisor' | 'admin';

export type TicketCategory = 'garbage' | 'electricity' | 'water' | 'other';

export type TicketStatus = 
  | 'new' 
  | 'assigned' 
  | 'in_progress' 
  | 'waiting_supervisor' 
  | 'resolved' 
  | 'closed' 
  | 'reopened';

export type TicketEventType = 
  | 'created' 
  | 'assigned' 
  | 'status_changed' 
  | 'comment' 
  | 'escalated' 
  | 'resolved' 
  | 'closed' 
  | 'reopened';

export type AttachmentKind = 'photo' | 'document';

export interface User {
  id: string;
  role: UserRole;
  name: string;
  phone?: string;
  email?: string;
  password_hash: string;
  created_at: string;
}

export interface StaffProfile {
  user_id: string;
  department?: string;
  ward?: string;
  reports_to?: string;
}

export interface Ticket {
  id: string;
  created_by: string;
  category: TicketCategory;
  title?: string;
  description: string;
  address_text?: string;
  lat?: number;
  lng?: number;
  status: TicketStatus;
  assigned_to?: string;
  current_supervisor?: string;
  citizen_rating?: number;
  citizen_feedback?: string;
  created_at: string;
  updated_at: string;
  closed_at?: string;
}

export interface TicketEvent {
  id: string;
  ticket_id: string;
  actor_id: string;
  type: TicketEventType;
  from_status?: TicketStatus;
  to_status?: TicketStatus;
  message?: string;
  created_at: string;
}

export interface TicketAttachment {
  id: string;
  ticket_id: string;
  uploaded_by: string;
  kind: AttachmentKind;
  url: string;
  mime_type?: string;
  caption?: string;
  created_at: string;
}

// Mutator input types
export interface CreateTicketInput {
  category: TicketCategory;
  title?: string;
  description: string;
  address_text?: string;
  lat?: number;
  lng?: number;
  attachmentUrls?: string[];
}

export interface AssignTicketInput {
  ticketId: string;
  staffId: string;
}

export interface StartWorkInput {
  ticketId: string;
  message?: string;
}

export interface AddStaffUpdateInput {
  ticketId: string;
  message: string;
  attachmentUrls?: string[];
}

export interface EscalateToSupervisorInput {
  ticketId: string;
  supervisorId: string;
  message?: string;
}

export interface MarkResolvedInput {
  ticketId: string;
  message?: string;
  attachmentUrls?: string[];
}

export interface CitizenCloseTicketInput {
  ticketId: string;
  rating?: number;
  feedback?: string;
}

export interface ReopenTicketInput {
  ticketId: string;
  reason: string;
}

// Auth types
export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    role: UserRole;
    name: string;
  };
}

export interface AuthContext {
  userID: string;
  role: UserRole;
}

// Query result types
export interface TicketDetailResult {
  ticket: Ticket;
  events: TicketEvent[];
  attachments: TicketAttachment[];
}
