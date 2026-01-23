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
    "water issue",
    "electricity issue",
    "garbage issue",
    "other issues"
  ];


dotenv.config();

const app = express();
const PORT = process.env.API_PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For form-urlencoded requests

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
      (name: string, args: any) => {
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
      (transact: any) =>
        transact(async (tx: any, name: string, args: any) => {
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
      Act as a civic issue reporter. Analyze the provided image and generate a structured report.
      
      Available Categories: ${categories.join(', ')}.

      Return ONLY a JSON object with the following fields:
      - "category": The most appropriate category from the list above.
      - "title": A concise, professional title for the issue (max 10 words).
      - "description": A detailed, objective description of what is seen in the image, explaining the civic problem clearly.

      If the image is not a civic issue, set category to "others", title to "Unidentified Issue", and description to "The image does not appear to show a clear civic problem."
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
                url: image.startsWith('http') ? image : (image.startsWith('data:') ? image : `data:image/jpeg;base64,${image}`),
              },
            },
          ],
        },
      ],
      response_format: { type: "json_object" } 
    });

    // Extract the JSON string from the response
    const content = response.choices[0].message.content || "{}";
    const result = JSON.parse(content);

    res.json({
      category: result.category || "others",
      title: result.title || "New Civic Issue",
      description: result.description || "No description provided.",
      confidence: "high"
    });

  } catch (error) {
    console.error('AI Classification error:', error);
    res.status(500).json({ error: 'Failed to process image with AI' });
  }
});

// Heritage Walk API Proxy Endpoints
const HERITAGE_WALK_BASE_URL = 'https://gccservices.in/heritagewalk';

// Get booking details by reference ID
app.get('/api/heritage-walk/booking-details', async (req, res) => {
  try {
    const { refId } = req.query;
    if (!refId) {
      return res.status(400).json({ error: 'refId is required' });
    }

    const response = await fetch(
      `${HERITAGE_WALK_BASE_URL}/registration/api/bookingdetails?refId=${refId}`
    );
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Heritage Walk proxy error:', error);
    res.status(500).json({ error: 'Failed to fetch booking details' });
  }
});

// Get booking list by mobile number
app.get('/api/heritage-walk/booking-list', async (req, res) => {
  try {
    const { mobileno } = req.query;
    if (!mobileno) {
      return res.status(400).json({ error: 'mobileno is required' });
    }

    const response = await fetch(
      `${HERITAGE_WALK_BASE_URL}/registration/api/getlist?mobileno=${mobileno}`
    );
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Heritage Walk proxy error:', error);
    res.status(500).json({ error: 'Failed to fetch booking list' });
  }
});

// Get all booking counts
app.get('/api/heritage-walk/booking-counts', async (req, res) => {
  try {
    const response = await fetch(
      `${HERITAGE_WALK_BASE_URL}/registration/api/getAllBookingCounts`
    );
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Heritage Walk proxy error:', error);
    res.status(500).json({ error: 'Failed to fetch booking counts' });
  }
});

// Save individual registration
app.post('/api/heritage-walk/save-individual', async (req, res) => {
  try {
    const formData = new URLSearchParams();
    Object.keys(req.body).forEach(key => {
      formData.append(key, req.body[key]);
    });

    const response = await fetch(
      `${HERITAGE_WALK_BASE_URL}/registration/api/saveIndividualRegistration`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      }
    );
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Heritage Walk proxy error:', error);
    res.status(500).json({ error: 'Failed to save individual registration' });
  }
});

// Save family registration
app.post('/api/heritage-walk/save-family', async (req, res) => {
  try {
    const formData = new URLSearchParams();
    Object.keys(req.body).forEach(key => {
      formData.append(key, req.body[key]);
    });

    const response = await fetch(
      `${HERITAGE_WALK_BASE_URL}/registration/api/saveFamilyRegistration`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      }
    );
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Heritage Walk proxy error:', error);
    res.status(500).json({ error: 'Failed to save family registration' });
  }
});

// Save school registration
app.post('/api/heritage-walk/save-school', async (req, res) => {
  try {
    const formData = new URLSearchParams();
    Object.keys(req.body).forEach(key => {
      formData.append(key, req.body[key]);
    });

    const response = await fetch(
      `${HERITAGE_WALK_BASE_URL}/registration/api/saveSchoolRegistration`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      }
    );
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Heritage Walk proxy error:', error);
    res.status(500).json({ error: 'Failed to save school registration' });
  }
});

// Save college registration
app.post('/api/heritage-walk/save-college', async (req, res) => {
  try {
    const formData = new URLSearchParams();
    Object.keys(req.body).forEach(key => {
      formData.append(key, req.body[key]);
    });

    const response = await fetch(
      `${HERITAGE_WALK_BASE_URL}/registration/api/saveCollegeRegistration`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      }
    );
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Heritage Walk proxy error:', error);
    res.status(500).json({ error: 'Failed to save college registration' });
  }
});

// Get PDF download URL (returns URL, doesn't proxy the actual PDF)
app.get('/api/heritage-walk/pdf-url', async (req, res) => {
  try {
    const { ID } = req.query;
    if (!ID) {
      return res.status(400).json({ error: 'ID is required' });
    }

    const pdfUrl = `${HERITAGE_WALK_BASE_URL}/api/pdf/download?ID=${ID}`;
    res.json({ url: pdfUrl });
  } catch (error) {
    console.error('Heritage Walk proxy error:', error);
    res.status(500).json({ error: 'Failed to generate PDF URL' });
  }
});


app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`API server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

export default app;