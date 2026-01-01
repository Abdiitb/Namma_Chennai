import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { authMiddleware, loginUser, AuthenticatedRequest } from './auth';
import { ZERO_QUERIES } from './zero-queries';
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

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

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

// Zero queries endpoint
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