const { Zero, createBuilder, createSchema, table, string, number } = require('@rocicorp/zero');

// Create the same schema as backend
const users = table('users').columns({
  id: string(),
  role: string(),
  name: string(),
  phone: string().optional(),
  email: string().optional(),
  password_hash: string(),
  created_at: number(),
}).primaryKey('id');

const tickets = table('tickets').columns({
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
}).primaryKey('id');

const staff_profiles = table('staff_profiles').columns({
  user_id: string(),
  department: string().optional(),
  ward: string().optional(),
  reports_to: string().optional(),
}).primaryKey('user_id');

const ticket_events = table('ticket_events').columns({
  id: string(),
  ticket_id: string(),
  actor_id: string(),
  type: string(),
  from_status: string().optional(),
  to_status: string().optional(),
  message: string().optional(),
  created_at: number(),
}).primaryKey('id');

const ticket_attachments = table('ticket_attachments').columns({
  id: string(),
  ticket_id: string(),
  uploaded_by: string(),
  kind: string(),
  url: string(),
  mime_type: string().optional(),
  caption: string().optional(),
  created_at: number(),
}).primaryKey('id');

const schema = createSchema({
  tables: [users, staff_profiles, tickets, ticket_events, ticket_attachments],
});

const zql = createBuilder(schema);

// Try to get schema hash by checking what backend sent  
const backendSchemaFromAPI = require('../apps/api/dist/schema.js');
console.log('Backend schema object:', Object.keys(backendSchemaFromAPI));
console.log('Backend schema hash:', backendSchemaFromAPI.schema?.hash);

console.log('Frontend schema hash:', schema.hash);
console.log('zql.tickets:', zql.tickets);

// Test direct Zero connection
async function testZeroConnection() {
  try {
    const z = new Zero({
      server: 'http://192.168.1.102:4848',
      schema,
      userID: 'test-user',
      auth: 'anonymous',
      kvStore: 'mem',
    });

    console.log('Zero client created');
    
    // Try the correct API for Zero v0.25.6
    const tickets = await z.run(zql.tickets);
    console.log('Direct query result:', tickets);
    
    z.close();
  } catch (error) {
    console.error('Zero connection error:', error);
  }
}

testZeroConnection();