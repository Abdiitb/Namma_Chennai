# Namma Chennai - Citizen Services Platform

A full-stack citizen services platform built with React Native (Expo), Node.js API, and Zero real-time sync.

## Quick Start

**Note**: This project uses individual npm installs per service (not monorepo workspaces).

```bash
# 1. Copy environment variables
cp .env.example .env

# 2. Start services in separate terminals:

# Terminal 1: Start database
docker compose up -d postgres

# Terminal 2: Start API server
cd apps/api && npm run dev

# Terminal 3: Start Zero cache server
cd apps/zero && npx zero-cache-dev --upstream-db postgresql://postgres:password@localhost:5432/citizen_services --port 4848

# Terminal 4: Start frontend (optional)
cd frontend && npm start
```

## Services & Ports

| Service | URL | Status |
|---------|-----|--------|
| API Server | http://localhost:3000 | ✅ Running |
| API Health | http://localhost:3000/health | ✅ Working |
| Zero Cache | http://localhost:4848 | ✅ Running |
| Frontend | http://localhost:8081 | ✅ Ready |
| Database | localhost:5432 | ✅ Running |

## Architecture

```
├── apps/
│   ├── api/          # Node.js/Express API server
│   └── zero/         # Zero cache configuration
├── packages/
│   └── shared/       # Shared Zero schema & TypeScript types
├── frontend/         # Expo React Native app (existing)
└── docker-compose.yml # PostgreSQL database
```

## Alternative: Using NPM Scripts

You can also use these convenient npm scripts from the root directory:

```bash
# Database management
npm run db:up          # Start PostgreSQL
npm run db:down        # Stop PostgreSQL  
npm run db:reset       # Reset database with fresh data

# Development servers
npm run dev:api        # Start API server (port 3000)
npm run dev:zero       # Start Zero cache (port 4848)  
npm run dev:frontend   # Start Expo frontend (port 8081)

# Cleanup
npm run clean          # Remove all node_modules
```

## Prerequisites

- Node.js 18+
- npm 8+ 
- Docker & Docker Compose
- Expo CLI (for frontend: `npm install -g @expo/cli`)

### Frontend Setup

The frontend is already configured in the `frontend/` directory. To connect:

```bash
cd frontend
npm install
npm start
```

**Important for device testing:** Update the IP addresses in `frontend/zero/provider.tsx`:
```typescript
const API_BASE_URL = 'http://YOUR_LAN_IP:3000';  // e.g., 'http://192.168.1.100:3000'
const ZERO_SERVER_URL = 'http://YOUR_LAN_IP:4848';
```

## Demo Users

All demo users have password `password123`:

| Email | Role | Description |
|-------|------|-------------|
| `admin@city.gov` | admin | System administrator |
| `supervisor@city.gov` | supervisor | Department supervisor |
| `staff@city.gov` | staff | Field staff member |
| `raj@example.com` | citizen | Regular citizen |
| `priya@example.com` | citizen | Regular citizen |

## API Endpoints

### Authentication
- `POST /auth/login` - Login with email/password

### Zero Endpoints  
- `POST /api/zero/queries` - Execute named queries
- `POST /api/zero/mutate` - Execute mutations

### Available Queries
- `myTickets` - Citizen's tickets
- `assignedTickets` - Staff's assigned tickets  
- `supervisorQueue` - Supervisor's pending tickets
- `ticketDetail` - Full ticket with events & attachments

### Available Mutators
- `createTicket` - Create new ticket (citizens)
- `assignTicket` - Assign to staff (supervisors)
- `startWork` - Mark in progress (staff)
- `addStaffUpdate` - Add comments (staff)
- `escalateToSupervisor` - Escalate to supervisor (staff)
- `markResolved` - Mark resolved (staff/supervisors)
- `citizenCloseTicket` - Close with rating (citizens)
- `reopenTicket` - Reopen closed ticket (citizens)

## Frontend Integration

### Zero Provider Setup

Wrap your app with the ZeroProvider:

```tsx
import ZeroProvider from './zero/provider';

export default function App() {
  return (
    <ZeroProvider>
      <YourAppContent />
    </ZeroProvider>
  );
}
```

### Using Zero in Components

```tsx
import { useZero } from './zero/provider';

function MyTickets() {
  const { zero, user, isAuthenticated } = useZero();
  
  // Query tickets
  const [tickets] = zero.useQuery('myTickets');
  
  // Create ticket mutation
  const createTicket = zero.useMutation('createTicket');
  
  return (
    <View>
      {/* Your UI here */}
    </View>
  );
}
```

### Required Dependencies

Add to your frontend `package.json`:

```json
{
  "dependencies": {
    "@citizen-services/shared": "workspace:*",
    "@rocicorp/zero": "^0.25.6",
    "@react-native-async-storage/async-storage": "^2.1.0",
    "expo-sqlite": "^16.0.10"
  }
}
```

## Database Schema

### Core Tables

- **users** - All users (citizens, staff, supervisors, admins)
- **staff_profiles** - Additional staff information
- **tickets** - Service requests/complaints
- **ticket_events** - Activity timeline
- **ticket_attachments** - Photos/documents

### Ticket Workflow

```
new → assigned → in_progress → resolved → closed
  ↓       ↓           ↓
reopened  escalated → waiting_supervisor
```

## Development Commands

```bash
# Development
pnpm dev                    # Start everything
pnpm dev:quick             # Start API + Zero only (DB must be running)

# Database  
pnpm db:up                 # Start PostgreSQL
pnpm db:down               # Stop PostgreSQL  
pnpm db:reset              # Reset database & re-run migrations
pnpm migrate               # Run migrations manually

# Building
pnpm build:shared          # Build shared package
pnpm build                 # Build shared + API

# Cleanup
pnpm clean                 # Remove all node_modules
```

## Troubleshooting

### First-time Setup Issues
```bash
# If you get "module not found" errors, ensure dependencies are installed:
pnpm install

# If you get workspace warnings, they're harmless but to fix:
# Make sure pnpm-workspace.yaml exists (should be created by setup)

# If migration fails, ensure database is running first:
pnpm db:up
sleep 10  # Wait for DB to be ready
pnpm migrate
```

### Database Connection Issues
```bash
# Check if PostgreSQL is running
docker ps

# View database logs  
docker logs citizen_services_db

# Reset database completely
pnpm db:reset
```

### Zero Cache Issues
```bash
# Check Zero cache logs
pnpm --filter zero dev

# Verify Zero config
cat apps/zero/zero.config.js
```

### Frontend Connection Issues

1. **Device Testing**: Update IP addresses in `frontend/zero/provider.tsx`
2. **Auth Issues**: Check that JWT_SECRET matches between API and Zero
3. **CORS Issues**: Zero config includes localhost origins

### API Issues
```bash
# Check API server logs
pnpm --filter api dev

# Test auth endpoint
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"raj@example.com","password":"password123"}'

# Check available endpoints
curl http://localhost:3000/api/zero/available-queries
```

## Production Notes

This is a **prototype setup**. For production:

1. Use proper environment variables for secrets
2. Set up proper SSL/HTTPS
3. Use production-ready PostgreSQL (not Docker)
4. Implement proper error handling & logging
5. Add input validation & sanitization
6. Set up proper backup & monitoring
7. Use PostgreSQL enums instead of TEXT constraints
8. Implement proper user management & registration

## Tech Stack

- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL 15
- **Real-time**: Zero Cache + Zero Schema  
- **Frontend**: Expo React Native + TypeScript
- **Auth**: JWT tokens (prototype only)
- **Development**: Docker Compose + pnpm workspaces