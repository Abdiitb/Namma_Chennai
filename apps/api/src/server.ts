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
import { dbProvider } from './database';
import {handleMutateRequest} from '@rocicorp/zero/server'
import {mustGetMutator} from '@rocicorp/zero'
import { mutators } from './mutators';


import { OpenAI } from 'openai';
// Initialize LiteLLM client with the provided Grid details
const litellm = new OpenAI({
  apiKey: process.env.GRID_API_KEY || "",
  baseURL: "https://grid.ai.juspay.net/v1", // Note: adding /v1 is standard for OpenAI-compatible proxies
});
const categories = [
    "pothole",
    "garbage",
    "broken_street_light",
    "water_leakage",
    "illegal_parking",
    "vandalism",
    "others"
  ];


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
    // console.log('Zero query request body:', JSON.stringify(req.body));
    
    // Pass the body directly to handleQueryRequest (it accepts ReadonlyJSONValue)
    const result = await handleQueryRequest(
      (name, args) => {
        console.log(`Transforming query: ${name}`, args);
        const query = mustGetQuery(ZERO_QUERIES, name);
        // For anonymous/development access, use 'anon' as userID
        return query.fn({ args, ctx: { userID: 'anon', role: 'anon' } });
      },
      schema,
      req.body  // Pass body directly, not wrapped in Request
    );
    
    // console.log('Zero query result:', JSON.stringify(result));
    res.json(result);
  } catch (error) {
    console.error('Zero query error:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

// Zero mutate endpoint - UPDATED to use handleMutateRequest
app.post('/api/zero/mutate', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const auth = req.auth!;
    console.log('--- /api/zero/mutate called ---');
    console.log('Request body:', req);
    console.log('Authenticated user:', auth);
    // Create context from authenticated user
    const ctx = {
      userID: auth.userID,
      role: auth.role,
    };

    console.log('Calling handleMutateRequest...');
    console.log('DB Provider:', dbProvider);
    // Convert req.query (ParsedQs) to Record<string, string>
    const queryObj: Record<string, string> = {};
    for (const key in req.query) {
      const val = req.query[key];
      if (typeof val === 'string') queryObj[key] = val;
      // If you expect arrays, you can join: else if (Array.isArray(val)) queryObj[key] = val.join(',');
    }
    const result = await handleMutateRequest(
      dbProvider,
      (transact) =>
        transact(async (tx, name, args) => {
          console.log(`Processing mutator: ${name} for user: ${ctx.userID} (${ctx.role})`);
          const mutator = mustGetMutator(mutators, name);
          return mutator.fn({
            tx,
            ctx,
            args,
          });
        }),
      queryObj,
      req.body
    );
    // const jsonBody = await req.body.json();
    // console.log('Mutate request body JSON:', jsonBody);
    console.log('handleMutateRequest result:', result);
    res.status(200).json(result);
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


app.post('/api/ai/classify-image', async (req, res) => {
  try {
    const { image } = req.body;

    if (!image || !Array.isArray(categories)) {
      return res.status(400).json({ error: 'Image (base64) and categories array are required' });
    }

    const prompt = `
      Analyze this image and classify it into exactly one of the following categories:
      ${categories.join(', ')}.
      
      Respond with ONLY the name of the category. If it doesn't fit any, respond "unclassified".
    `;

    const response = await litellm.chat.completions.create({
      model: "gemini-3-pro-preview", 
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                // Ensure image is a data URI: data:image/jpeg;base64,...
                url: image.startsWith('http') ? image : (image.startsWith('data:') ? image : `data:image/jpeg;base64,${image}`),              },
            },
          ],
        },
      ],
      reasoning_effort: "medium", 
    });

    const identifiedCategory = response.choices[0].message.content?.trim().toLowerCase();

    res.json({
      category: identifiedCategory,
      confidence: "high", 
    });

  } catch (error) {
    console.error('AI Classification error:', error);
    res.status(500).json({ error: 'Failed to process image with AI' });
  }
});


app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`API server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

export default app;