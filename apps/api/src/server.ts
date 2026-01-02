import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { authMiddleware, loginUser, registerUser, AuthenticatedRequest } from './auth';
import { ZERO_QUERIES } from './zero-queries';
import { handleQueryRequest } from '@rocicorp/zero/server';
import { mustGetQuery } from '@rocicorp/zero';
import { schema } from './schema';
import {
  getMyTickets,
  getAssignedTickets,
  getSupervisorQueue,
  getTicketDetail,
} from './queries';
import {
  createTicket,
  assignTicket,
  startWork,
  addStaffUpdate,
  escalateToSupervisor,
  markResolved,
  citizenCloseTicket,
  reopenTicket,
} from './mutators';

dotenv.config();

const app = express();
const PORT = process.env.API_PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Auth endpoint
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const result = await loginUser(email, password);
    res.json(result);
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// NEW: Registration endpoint
app.post('/auth/register', async (req, res) => {
  try {
    const { email, password, name, role } = req.body;
    
    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate password length
    // if (password.length < 6) {
    //   return res.status(400).json({ error: 'Password must be at least 6 characters' });
    // }

    // Default role to 'citizen' if not provided
    const userRole = role || 'citizen';
    
    // Validate role
    if (!['citizen', 'staff', 'supervisor', 'admin'].includes(userRole)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const result = await registerUser(email, password, name, userRole);
    res.status(201).json(result);
  } catch (error) {
    console.error('Registration error:', error);
    const message = (error as Error).message;
    
    if (message.includes('already exists')) {
      res.status(409).json({ error: message });
    } else {
      res.status(500).json({ error: message || 'Registration failed' });
    }
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Zero query endpoint - This is what zero-cache calls to get ZQL for each query
// The request body is in the format ["query", [{id, name, args}, ...]]
// The response should be ["transformed", [{id, name, ast}, ...]]
app.post('/api/zero/query', async (req, res) => {
  try {
    console.log('Zero query request body:', JSON.stringify(req.body));
    
    // Pass the body directly to handleQueryRequest (it accepts ReadonlyJSONValue)
    const result = await handleQueryRequest(
      (name, args) => {
        console.log(`Transforming query: ${name}`, args);
        const query = mustGetQuery(ZERO_QUERIES, name);
        // For anonymous/development access, use 'anon' as userID
        return query.fn({ args, ctx: { userID: 'anon' } });
      },
      schema,
      req.body  // Pass body directly, not wrapped in Request
    );
    
    console.log('Zero query result:', JSON.stringify(result));
    res.json(result);
  } catch (error) {
    console.error('Zero query error:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

// Zero queries endpoint (legacy)
app.post('/api/zero/queries', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const { queryName, args } = req.body;
    const auth = req.auth!;

    console.log(`Processing query: ${queryName} for user: ${auth.userID} (${auth.role})`);

    let result;
    switch (queryName) {
      case 'myTickets':
        result = await getMyTickets(auth);
        break;
      case 'assignedTickets':
        result = await getAssignedTickets(auth);
        break;
      case 'supervisorQueue':
        result = await getSupervisorQueue(auth);
        break;
      case 'ticketDetail':
        if (!args?.ticketId) {
          return res.status(400).json({ error: 'ticketId is required' });
        }
        result = await getTicketDetail(args.ticketId, auth);
        break;
      default:
        return res.status(400).json({ error: `Unknown query: ${queryName}` });
    }

    res.json({ data: result });
  } catch (error) {
    console.error('Query error:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

// Zero mutate endpoint
app.post('/api/zero/mutate', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const { mutatorName, input } = req.body;
    const auth = req.auth!;

    console.log(`Processing mutator: ${mutatorName} for user: ${auth.userID} (${auth.role})`);

    let result;
    switch (mutatorName) {
      case 'createTicket':
        result = await createTicket(input, auth);
        break;
      case 'assignTicket':
        result = await assignTicket(input, auth);
        break;
      case 'startWork':
        result = await startWork(input, auth);
        break;
      case 'addStaffUpdate':
        result = await addStaffUpdate(input, auth);
        break;
      case 'escalateToSupervisor':
        result = await escalateToSupervisor(input, auth);
        break;
      case 'markResolved':
        result = await markResolved(input, auth);
        break;
      case 'citizenCloseTicket':
        result = await citizenCloseTicket(input, auth);
        break;
      case 'reopenTicket':
        result = await reopenTicket(input, auth);
        break;
      default:
        return res.status(400).json({ error: `Unknown mutator: ${mutatorName}` });
    }

    res.json({ data: result });
  } catch (error) {
    console.error('Mutator error:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

// For debugging: list all available queries
app.get('/api/zero/available-queries', (req, res) => {
  res.json({
    queries: Object.keys(ZERO_QUERIES),
    mutators: [
      'createTicket',
      'assignTicket',
      'startWork',
      'addStaffUpdate',
      'escalateToSupervisor',
      'markResolved',
      'citizenCloseTicket',
      'reopenTicket'
    ]
  });
});

app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

export default app;