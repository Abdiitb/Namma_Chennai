import { createSchema, table, string, number, createBuilder, definePermissions, ANYONE_CAN_DO_ANYTHING } from '@rocicorp/zero';

export const users = table('users')
  .columns({
    id: string(),
    role: string(),
    name: string(),
    phone: string().optional(),
    email: string().optional(),
    password_hash: string(),
    created_at: number(),
  })
  .primaryKey('id');

export const staff_profiles = table('staff_profiles')
  .columns({
    user_id: string(),
    department: string().optional(),
    ward: string().optional(),
    reports_to: string().optional(),
  })
  .primaryKey('user_id');

export const tickets = table('tickets')
  .columns({
    id: string(),
    created_by: string(),
    category: string(),
    title: string().optional(),
    description: string(),
    address_text: string().optional(),
    lat: number().optional(),
    lng: number().optional(),
    status: string(),
    assigned_to: string().optional(),
    current_supervisor: string().optional(),
    citizen_rating: number().optional(),
    citizen_feedback: string().optional(),
    created_at: number(),
    updated_at: number(),
    closed_at: number().optional(),
  })
  .primaryKey('id');

export const ticket_events = table('ticket_events')
  .columns({
    id: string(),
    ticket_id: string(),
    actor_id: string(),
    type: string(),
    from_status: string().optional(),
    to_status: string().optional(),
    message: string().optional(),
    created_at: number(),
  })
  .primaryKey('id');

export const ticket_attachments = table('ticket_attachments')
  .columns({
    id: string(),
    ticket_id: string(),
    uploaded_by: string(),
    kind: string(),
    url: string(),
    mime_type: string().optional(),
    caption: string().optional(),
    created_at: number(),
  })
  .primaryKey('id');

export const schema = createSchema({
  tables: [
    users,
    staff_profiles,
    tickets,
    ticket_events,
    ticket_attachments,
  ],
});

export const zql = createBuilder(schema);

// Debug: Log the query builder construction
console.log('🔧 Schema Debug:', {
  schema: schema,
  zql: zql,
  zqlTickets: zql.tickets,
  zqlUsers: zql.users
});

// Simplified permissions for now - deprecation warnings can be addressed later
export const permissions = definePermissions<unknown, typeof schema>(schema, () => ({
  users: ANYONE_CAN_DO_ANYTHING,
  staff_profiles: ANYONE_CAN_DO_ANYTHING,
  tickets: ANYONE_CAN_DO_ANYTHING,
  ticket_events: ANYONE_CAN_DO_ANYTHING,
  ticket_attachments: ANYONE_CAN_DO_ANYTHING,
}));
