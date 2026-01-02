# Namma Chennai - Citizen Services Platform

A full-stack citizen services platform built with React Native (Expo), Node.js API, and Zero real-time sync.

## Quick Start

```bash
# 1. Start database
docker compose up -d postgres

# 2. Start API server (in new terminal)
cd apps/api && npm run dev

# 3. Start Zero cache server (in new terminal)
cd apps/zero && npm run dev

# 4. Start frontend (in new terminal - optional)
cd frontend && npm start
```

## Services & Ports

| Service | URL | 
|---------|-----|
| API Server | http://localhost:3000 |
| Zero Cache | http://localhost:4848 |
| Frontend | http://localhost:8081 |
| Database | localhost:5432 |

## Project Structure

```
├── apps/
│   ├── api/          # Node.js API server (has schema, types, queries)
│   └── zero/         # Zero cache server
├── frontend/         # React Native app (has its own schema copy)
└── docker-compose.yml
```

## Demo Users

All demo users have password `password123`:

| Email | Role |
|-------|------|
| `raj@example.com` | citizen |
| `staff@city.gov` | staff |
| `supervisor@city.gov` | supervisor |
| `admin@city.gov` | admin |

## Making Schema/Query Changes

When you change the schema or queries, update **both** locations:

1. **Frontend**: `frontend/zero/schema.ts` and `frontend/zero/queries.ts`
2. **Backend**: `apps/api/src/schema.ts` and `apps/api/src/zero-queries.ts`

Then rebuild the API:
```bash
cd apps/api && npm run build
```

## Useful Commands

```bash
# Database
npm run db:up          # Start database
npm run db:down        # Stop database
npm run db:reset       # Reset with fresh data

# Development
npm run dev:api        # Start API (port 3000)
npm run dev:zero       # Start Zero cache (port 4848)
npm run dev:frontend   # Start Expo (port 8081)

# Cleanup
npm run clean          # Remove all node_modules
```

## API Endpoints

### Auth
- `POST /auth/login` - Login with email/password

### Queries & Mutations
- `POST /api/zero/queries` - Run queries (myTickets, assignedTickets, etc.)
- `POST /api/zero/mutate` - Run mutations (createTicket, assignTicket, etc.)

## Frontend Setup

```bash
cd frontend
npm install
npm start
```

**For device testing**: Update IPs in `frontend/zero/provider.tsx`:
```typescript
const API_BASE_URL = 'http://192.168.1.100:3000';  // Your LAN IP
const ZERO_SERVER_URL = 'http://192.168.1.100:4848';
```

## Troubleshooting

### Database Issues
```bash
docker ps                    # Check if running
docker logs postgres         # View logs
npm run db:reset            # Reset database
```

### API Issues
```bash
# Test login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"raj@example.com","password":"password123"}'

# Check health
curl http://localhost:3000/health
```

### Module Not Found
```bash
cd apps/api && npm install
cd apps/zero && npm install
cd frontend && npm install
```

## Tech Stack

- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL 15
- **Real-time**: Zero Cache
- **Frontend**: Expo + React Native
- **Auth**: JWT tokens